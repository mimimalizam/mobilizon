# Šta bih trebao da backup-ujem?

Ukoliko je Postgres na dockeru:

* DATE=$(date +%d%m%Y_%H-%M)
* docker compose exec -it mobilizon_db pg_dumpall -U [pg_user] | gzip -9c > db-$DATE.sql.gz

Ukoliko je Postgres na serveru, preporučio bih korišćenje pgbackrest.org.

Config file /etc/mobilizon/config.exs ili config/runtime.exs i uploads/


# Kako da povećam upload limit?

U mobilizon config fajlu moramo da promenimo/dodamo sledece linije:
  upload_limit: 10_485_760, #Promeni
  avatar_upload_limit: 10_097_152, #Promeni
  banner_upload_limit: 10_194_304, #Promeni

Naravno, treba promeniti i konfiguraciju na nginx serveru - client_max_body_size 16m;

# Postgres Upgrade Docker

Ukoliko koristimo docker, stop servisa i moramo da uradimo pg_dump opisanom ranije. Kada je pg_dump gotov, import dump-a sa pg_restore.

# Postgres Upgrade

Koristimo ekstenziju PostGIS za skladištenje geoprostornih podataka. Migracija na novu verziju PostgreSQL-a (pomoću komande pg_upgradecluster) nije podržana ukoliko se istovremeno nadograđuje i PostGIS.

Na primer, prilikom migracije sa Debian Buster (10) na Bullseye (11), PostgreSQL se nadograđuje sa verzije 11 na verziju 13, a PostGIS sa verzije 2.5 na verziju 3.1, što znači da neće biti moguće izvesti jednostavnu nadogradnju.

U ovom slučaju je bolje da:
    *Napravite dump baze podataka (pomoću komande pg_dump) sa starog PostgreSQL klastera.
    * Zaustavite stari klaster.
    * Kreirate i pokrenete novi klaster (ako to već nije urađeno prilikom nadogradnje sistema).
    * Ponovo kreirate bazu podataka i korisnika baze (koristeći pristupne podatke iz vaše konfiguracije za Mobilizon).
    *Ponovo dodate potrebne ekstenzije u bazu pomoću komande CREATE EXTENSION ekstenzija (gde su ekstenzije postgis, pg_trgm i unaccent).
    * Uvezete dump u vaš novi klaster (koristeći komandu pg_restore).

# User management
## Kako dodati user-u moderator/administrator permisije?

docker compose exec mobilizon mobilizon_ctl users.modify <email> [<options>]
Opcije:

    --email <email> - Korisnikov email
    --password <password> - Korisnikova nova lozinka (at least 6 characters with the default configuration)
    --user - Promeniti korisnika u obicnog korisnika
    --moderator - Dodavanje korisniku moderator privilegija
    --admin - Dodavanje korisniku admin privilegija
    --enable - Omoguci pristup korisniku
    --disable - Onemoguci pristup korisniku

## Brisanje korisnika

Briše jednog ili više korisnika Mobilizona koji odgovaraju određenom obrascu:
docker compose exec mobilizon mobilizon_ctl users.delete <email|obrazac> [<opcije>]
Opcije:

    --assume-yes ili -y – Ne traži potvrdu prilikom brisanja.
    --all-matching-email-domain – Briše sve korisnike koji imaju domen e-pošte koji odgovara datom obrascu.
    --all-matching-ip – Briše sve korisnike sa IP adresom koja odgovara datom obrascu.
    --include-groups-where-admin – Osim korisničkog naloga i njegovih profila, briše i grupe u kojima je ovaj korisnik administrator.
    --help ili -h – Prikazuje pomoć.

## Čišćenje nepotvrđenih korisnika

Ručno pokreće čišćenje nepotvrđenih korisnika (i njihovih profila).
docker compose exec mobilizon mobilizon_ctl users.clean [<opcije>]
Opcije:

    -v ili --verbose – Izlistava korisnike koji su obrisani. Automatski uključeno pri korišćenju opcije --dry-run.
    -d ili --days – Broj dana nakon kojeg će nepotvrđeni korisnik biti odabran za brisanje.
    --dry-run – Pokreće zadatak bez brisanja korisnika, samo ih izlistava. Automatski uključuje opciju --verbose.
