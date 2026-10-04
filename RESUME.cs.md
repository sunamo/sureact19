---
schema_version: 7
type: my_library
file_count: 29
avg_lines_per_file: 1103
move_to_legacy_percent: 15
generated_date: 2026-10-01
generated_time: 16:40:42
github_source_url: 
last_build_ok: yes
last_build_date: 2026-10-02
last_tests_run_date: n/a
covered_lines: 0
total_lines: 548
---

## Description

NPM knihovna `@sunamo/sureact19` s React 19 komponentami v TypeScriptu. Zatím obsahuje jen několik komponent (panel plánu záloh `BackupSchedulePanel`, nadpis `H1`), zbytek tvoří infrastruktura knihovny: testy, semantic-release, husky, barrel generátor a GitHub workflow. Poslední obsahová změna je z roku 2026-08.

## Původ zdrojáků

Staženo z GitHubu: **ne** — vlastní knihovna publikovaná v účtu sunamo.

- Ověřeno: origin je github.com/sunamo/sureact19, 62 commitů od 2025-06-16 (sunamo.cz, smutekutek, Radek Jančík a semantic-release-bot), skripty v `.scripts/` mají české komentáře, CHANGELOG odkazuje na sunamo/sureact19; `gh search repos` "typescript npm library template semantic-release barrelsby husky coverage badge" vrátil 0 výsledků, hash porovnání nebylo možné bez kandidáta.

## Doporučení přesunu do legacy

Doporučení přesunu do sunamocz-legacy.visualstudio.com: **15 %** — malá knihovna se dvěma komponentami a nízkým pokrytím testy (17,7 % dle README), ale je používána jako submodul jiných appek.

- Jen 2 skutečné komponenty (BackupSchedulePanel, H1) a nízké pokrytí testy.
- Je submodulem v `english-line-by-line` (viz jeho `.gitmodules`), takže smazání by rozbilo tu appku.
- Poslední obsahová změna 2026-08-22, repo je udržované.

## Vazby na moje repa

- Submoduly: žádné
- ProjectReference / PackageReference: žádné
