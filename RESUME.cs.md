---
schema_version: 4
type: library
file_count: 29
delete_recommendation_percent: 15
generated_date: 2026-09-30
generated_time: 16:44:08
github_origin: no
github_source_url: 
---

## Description

NPM knihovna `@sunamo/sureact19` s React 19 komponentami v TypeScriptu. Zatím obsahuje jen několik komponent (panel plánu záloh `BackupSchedulePanel`, nadpis `H1`), zbytek tvoří infrastruktura knihovny: testy, semantic-release, husky, barrel generátor a GitHub workflow. Poslední obsahová změna je z roku 2026-08.

## Původ zdrojáků

Staženo z GitHubu: **ne** — vlastní knihovna publikovaná v účtu sunamo.

- Ověřeno: origin je github.com/sunamo/sureact19, 62 commitů od 2025-06-16 (sunamo.cz, smutekutek, Radek Jančík a semantic-release-bot), skripty v `.scripts/` mají české komentáře, CHANGELOG odkazuje na sunamo/sureact19; `gh search repos` "typescript npm library template semantic-release barrelsby husky coverage badge" vrátil 0 výsledků, hash porovnání nebylo možné bez kandidáta.

## Doporučení ke smazání

Doporučení ke smazání: **15 %** — malá knihovna se dvěma komponentami a nízkým pokrytím testy (17,7 % dle README), ale je používána jako submodul jiných appek.

- Jen 2 skutečné komponenty (BackupSchedulePanel, H1) a nízké pokrytí testy.
- Je submodulem v `english-line-by-line` (viz jeho `.gitmodules`), takže smazání by rozbilo tu appku.
- Poslední obsahová změna 2026-08-22, repo je udržované.
