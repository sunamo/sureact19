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

export type BackupSchedulePanelProps = {
  backupOnExit: boolean;
  onBackupOnExitChange: (v: boolean) => void;
  backupIntervalMinutes: number | null;
  onBackupIntervalChange: (minutes: number | null) => void;
  maxBackupsToKeep: number;
  onMaxBackupsToKeepChange: (v: number) => void;
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
    maxBackups?: string;
    maxBackupsUnit?: string;
    onlineSuffix?: string;
  };
};

export function BackupSchedulePanel({
  backupOnExit,
  onBackupOnExitChange,
  backupIntervalMinutes,
  onBackupIntervalChange,
  maxBackupsToKeep,
  onMaxBackupsToKeepChange,
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
  const [maxBackupsInput, setMaxBackupsInput] = useState<string>(
    maxBackupsToKeep != null ? String(maxBackupsToKeep) : "5"
  );

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
    countdown: labels.countdown ?? ((t: string) => `Příští záloha za ${t}`),
    lastBackupNever: labels.lastBackupNever ?? "Nikdy",
    maxBackups: labels.maxBackups ?? "Max záloh",
    maxBackupsUnit: labels.maxBackupsUnit ?? "ks",
    onlineSuffix: labels.onlineSuffix,
    openOnDrive: labels.openOnDrive,
  };

  useEffect(() => {
    if (backupIntervalMinutes == null) { setCountdown(""); return; }
    if (nextBackupAt == null) { setCountdown(""); return; }
    const tick = () => {
      const remaining = nextBackupAt - Date.now();
      setCountdown(remaining > 0 ? l.countdown(formatCountdown(remaining)) : "");
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [backupIntervalMinutes, nextBackupAt]);

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

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Typography variant="body2">{l.maxBackups}</Typography>
        <TextField
          size="small"
          type="number"
          value={maxBackupsInput}
          onChange={(e) => {
            setMaxBackupsInput(e.target.value);
            const v = parseInt(e.target.value, 10);
            if (v > 0) onMaxBackupsToKeepChange(v);
          }}
          slotProps={{
            htmlInput: { min: 1, step: 1, style: { width: 64, textAlign: "right" } },
            input: { endAdornment: <InputAdornment position="end">{l.maxBackupsUnit}</InputAdornment> },
          }}
          sx={{ width: 110 }}
        />
        {backupCount != null && (
          <Typography variant="caption" color={maxBackupsToKeep != null && backupCount > maxBackupsToKeep ? "error" : "text.secondary"}>
            {l.onlineSuffix ? `${l.onlineSuffix} ${backupCount} ${l.maxBackupsUnit}` : `Online: ${backupCount} ${l.maxBackupsUnit}`}
          </Typography>
        )}
      </Box>

      <Stack spacing={1.5}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {l.schedule}
        </Typography>

        <FormControlLabel
          control={<Checkbox checked={backupOnExit} onChange={(e) => onBackupOnExitChange(e.target.checked)} size="small" />}
          label={<Typography variant="body2">{l.onExit}</Typography>}
          sx={{ m: 0 }}
        />

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
            {l.latestOnDrive}: {latestDriveBackup.name}
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
