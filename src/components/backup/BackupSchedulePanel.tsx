import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import BackupIcon from "@mui/icons-material/Backup";
import RestoreIcon from "@mui/icons-material/Restore";
import TimerIcon from "@mui/icons-material/Timer";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

function formatBackupName(name: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2})-(\d{2})-(\d{2})$/.exec(name);
  if (!m) return name;
  const [, y, mo, d, h, mi, s] = m;
  const date = new Date(+y, +mo - 1, +d, +h, +mi, +s);
  if (isNaN(date.getTime())) return name;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "nyní";
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1_000);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export type DriveBackupEntry = { id: string; name: string };

export type BackupRetentionSettings = {
  maxToday: number;
  retentionDays: number;
  maxPerDay: number;
};

export type BackupSchedulePanelProps = {
  backupOnExit: boolean;
  onBackupOnExitChange: (v: boolean) => void;
  backupIntervalMinutes: number | null;
  onBackupIntervalChange: (minutes: number | null) => void;
  retention: BackupRetentionSettings;
  onRetentionChange: (v: BackupRetentionSettings) => void;
  // Automaticke obnoveni pri startu (pull z Drive). Periodicke obnoveni sdili interval se zalohou
  // (backupIntervalMinutes) - proto zde uz neni samostatny restore interval.
  restoreOnStartup?: boolean;
  onRestoreOnStartupChange?: (v: boolean) => void;
  nextRestoreAt?: number;
  lastBackupAt?: string;
  nextBackupAt?: number;
  latestDriveBackup?: DriveBackupEntry | null;
  onBackupNow: () => void;
  onRestoreClick: () => void;
  onDeleteLatestBackup?: (entry: DriveBackupEntry) => void;
  onDeleteAllBackups?: () => void;
  onOpenLatestBackup?: (entry: DriveBackupEntry) => void;
  backupCount?: number;
  isDeletingBackup?: boolean;
  backingUp?: boolean;
  canRestore?: boolean;
  statusMessage?: { type: "success" | "error"; text: string } | null;
  labels?: {
    backupNow?: string;
    backingUp?: string;
    restore?: string;
    deleteLatest?: string;
    lastBackup?: string;
    latestOnDrive?: string;
    schedule?: string;
    onExit?: string;
    interval?: string;
    intervalUnit?: string;
    countdown?: (time: string) => string;
    lastBackupNever?: string;
    openOnDrive?: string;
    deleteAll?: string;
    maxBackupsToday?: string;
    backupRetentionDays?: string;
    maxBackupsPerDay?: string;
    unitPieces?: string;
    unitDays?: string;
    onlineSuffix?: string;
    restoreOnStartup?: string;
  };
};

export function BackupSchedulePanel({
  backupOnExit,
  onBackupOnExitChange,
  backupIntervalMinutes,
  onBackupIntervalChange,
  retention,
  onRetentionChange,
  restoreOnStartup,
  onRestoreOnStartupChange,
  nextRestoreAt,
  lastBackupAt,
  nextBackupAt,
  latestDriveBackup,
  onBackupNow,
  onRestoreClick,
  onDeleteLatestBackup,
  onDeleteAllBackups,
  onOpenLatestBackup,
  backupCount,
  isDeletingBackup = false,
  backingUp = false,
  canRestore = false,
  statusMessage,
  labels = {},
}: BackupSchedulePanelProps) {
  const [countdown, setCountdown] = useState<string>("");
  const [intervalInput, setIntervalInput] = useState<string>(
    backupIntervalMinutes != null ? String(backupIntervalMinutes) : "60"
  );
  const [retentionInput, setRetentionInput] = useState<Record<keyof BackupRetentionSettings, string>>({
    maxToday: String(retention.maxToday),
    retentionDays: String(retention.retentionDays),
    maxPerDay: String(retention.maxPerDay),
  });

  const l = {
    backupNow: labels.backupNow ?? "Zálohovat nyní",
    backingUp: labels.backingUp ?? "Zálohuji…",
    restore: labels.restore ?? "Obnovit ze zálohy",
    deleteLatest: labels.deleteLatest ?? "Smazat tuto zálohu z Drive",
    lastBackup: labels.lastBackup ?? "Poslední záloha",
    latestOnDrive: labels.latestOnDrive ?? "Na Google Drive",
    schedule: labels.schedule ?? "Automatické zálohování",
    onExit: labels.onExit ?? "Při ukončení aplikace",
    interval: labels.interval ?? "V časovém rytmu",
    intervalUnit: labels.intervalUnit ?? "min",
    countdown: labels.countdown ?? ((t: string) => `Příští synchronizace za ${t}`),
    lastBackupNever: labels.lastBackupNever ?? "Nikdy",
    maxBackupsToday: labels.maxBackupsToday ?? "Max záloh z dneška",
    backupRetentionDays: labels.backupRetentionDays ?? "Držet zálohy za posledních",
    maxBackupsPerDay: labels.maxBackupsPerDay ?? "Max záloh z každého dřívějšího dne",
    unitPieces: labels.unitPieces ?? "ks",
    unitDays: labels.unitDays ?? "dnů",
    onlineSuffix: labels.onlineSuffix,
    openOnDrive: labels.openOnDrive,
    restoreOnStartupLabel: labels.restoreOnStartup ?? "Obnovit při otevření aplikace",
  };

  // nextBackupAt a nextRestoreAt jsou dnes vzdy stejna hodnota - jde o jeden sjednoceny sync
  // cyklus (pull+push dohromady, viz performSync v main.ts), zadne dva nezavisle rytmy.
  useEffect(() => {
    const next = [
      backupIntervalMinutes != null ? nextBackupAt : null,
      nextRestoreAt,
    ].filter((v): v is number => v != null).sort((a, b) => a - b)[0];
    if (next == null) { setCountdown(""); return; }
    const tick = () => {
      const remaining = next - Date.now();
      setCountdown(remaining > 0 ? l.countdown(formatCountdown(remaining)) : "");
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [backupIntervalMinutes, nextBackupAt, nextRestoreAt]);

  const handleIntervalToggle = (checked: boolean) => {
    if (checked) {
      const mins = Math.max(1, parseInt(intervalInput, 10) || 60);
      setIntervalInput(String(mins));
      onBackupIntervalChange(mins);
    } else {
      onBackupIntervalChange(null);
    }
  };

  const handleIntervalInputChange = (val: string) => {
    setIntervalInput(val);
    const mins = parseInt(val, 10);
    if (mins > 0) onBackupIntervalChange(mins);
  };

  const handleRetentionChange = (key: keyof BackupRetentionSettings, val: string) => {
    setRetentionInput((prev) => ({ ...prev, [key]: val }));
    const n = parseInt(val, 10);
    const min = key === "retentionDays" ? 0 : 1;
    if (Number.isFinite(n) && n >= min) onRetentionChange({ ...retention, [key]: n });
  };

  // Kolik zaloh smi celkem zustat - podle nej se cervene zvyrazni pocet zaloh na Drive.
  const maxTotalBackups = retention.maxToday + retention.retentionDays * retention.maxPerDay;

  const retentionRows: { key: keyof BackupRetentionSettings; label: string; unit: string; min: number }[] = [
    { key: "maxToday", label: l.maxBackupsToday, unit: l.unitPieces, min: 1 },
    { key: "retentionDays", label: l.backupRetentionDays, unit: l.unitDays, min: 0 },
    { key: "maxPerDay", label: l.maxBackupsPerDay, unit: l.unitPieces, min: 1 },
  ];

  return (
    <>
      <Stack spacing={1}>
        {retentionRows.map((row) => (
          <Box key={row.key} sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography variant="body2" sx={{ minWidth: 220 }}>{row.label}</Typography>
            <TextField
              size="small"
              type="number"
              value={retentionInput[row.key]}
              onChange={(e) => handleRetentionChange(row.key, e.target.value)}
              slotProps={{
                htmlInput: { min: row.min, step: 1, style: { width: 64, textAlign: "right" } },
                input: { endAdornment: <InputAdornment position="end">{row.unit}</InputAdornment> },
              }}
              sx={{ width: 110 }}
            />
            {row.key === "maxToday" && backupCount != null && (
              <Typography variant="caption" color={backupCount > maxTotalBackups ? "error" : "text.secondary"}>
                {l.onlineSuffix ? `${l.onlineSuffix} ${backupCount} ${l.unitPieces}` : `Online: ${backupCount} ${l.unitPieces}`}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {l.schedule}
        </Typography>

        <FormControlLabel
          control={<Checkbox checked={backupOnExit} onChange={(e) => onBackupOnExitChange(e.target.checked)} size="small" />}
          label={<Typography variant="body2">{l.onExit}</Typography>}
          sx={{ m: 0 }}
        />

        {onRestoreOnStartupChange && (
          <FormControlLabel
            control={<Checkbox checked={restoreOnStartup ?? true} onChange={(e) => onRestoreOnStartupChange(e.target.checked)} size="small" />}
            label={<Typography variant="body2">{l.restoreOnStartupLabel}</Typography>}
            sx={{ m: 0 }}
          />
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={backupIntervalMinutes != null}
                onChange={(e) => handleIntervalToggle(e.target.checked)}
                size="small"
              />
            }
            label={<Typography variant="body2">{l.interval}</Typography>}
            sx={{ m: 0 }}
          />
          {backupIntervalMinutes != null && (
            <TextField
              size="small"
              type="number"
              value={intervalInput}
              onChange={(e) => handleIntervalInputChange(e.target.value)}
              slotProps={{
                htmlInput: { min: 1, step: 1, style: { width: 64, textAlign: "right" } },
                input: { endAdornment: <InputAdornment position="end">{l.intervalUnit}</InputAdornment> },
              }}
              sx={{ width: 110 }}
            />
          )}
        </Box>

        {countdown && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <TimerIcon sx={{ fontSize: 14, opacity: 0.6 }} />
          <Typography variant="caption" color="text.secondary">{countdown}</Typography>
        </Box>
      )}

      {latestDriveBackup && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <CloudDoneIcon sx={{ fontSize: 14, opacity: 0.55 }} />
          <Typography variant="caption" color="text.secondary">
            {l.latestOnDrive}: {formatBackupName(latestDriveBackup.name)}
          </Typography>
        </Box>
      )}

      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Button
          size="small"
          variant="outlined"
          startIcon={backingUp ? <CircularProgress size={14} /> : <BackupIcon />}
          onClick={onBackupNow}
          disabled={backingUp || isDeletingBackup}
        >
          {backingUp ? l.backingUp : l.backupNow}
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RestoreIcon />}
          onClick={onRestoreClick}
          disabled={!canRestore || backingUp || isDeletingBackup}
        >
          {l.restore}
        </Button>
        {latestDriveBackup && onOpenLatestBackup && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<OpenInNewIcon />}
            onClick={() => onOpenLatestBackup(latestDriveBackup)}
            disabled={isDeletingBackup}
          >
            {l.openOnDrive ?? "Otevřít na Drive"}
          </Button>
        )}
        {onDeleteAllBackups && backupCount != null && backupCount > 0 && (
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={isDeletingBackup ? <CircularProgress size={14} color="error" /> : <DeleteOutlineIcon />}
            onClick={onDeleteAllBackups}
            disabled={isDeletingBackup || backingUp}
          >
            {labels.deleteAll ?? "Smazat všechny zálohy z Google Drive"}
          </Button>
        )}
      </Stack>

        {statusMessage?.type === "success" && (
          <Alert severity="success" sx={{ py: 0.5 }}>{statusMessage.text}</Alert>
        )}
        {statusMessage?.type === "error" && (
          <Alert severity="error" sx={{ py: 0.5 }}>{statusMessage.text}</Alert>
        )}
      </Stack>
    </>
  );
}
