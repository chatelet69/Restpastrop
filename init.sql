CREATE IF NOT EXISTS DATABASE restpastrop;
USE restpastrop;

create table if not exists users
(
    id       int auto_increment
        primary key,
    username varchar(30)                   null,
    email    varchar(255)                  null,
    name     varchar(40) default 'Inconnu' null,
    lastname varchar(40) default 'Inconnu' null,
    password varchar(255)                  null,
    `rank`   varchar(20) default 'user'    not null,
    jwt      varchar(255)                  null
);

create table if not exists apparts
(
    id         int auto_increment
        primary key,
    owner      int          not null,
    title      varchar(200) null,
    address    varchar(200) null,
    status     varchar(15)  null,
    price      int          null,
    area       int          null,
    nb_rooms   int          null,
    max_people int          null,
    startDate  datetime     null,
    endDate    datetime     null,
    constraint apparts_users_id_fk
        foreign key (owner) references users (id)
            on update cascade on delete cascade
);

create table if not exists reservation
(
    id        int auto_increment
        primary key,
    clientId  int         not null,
    appartId  int         not null,
    startDate datetime    not null,
    endDate   datetime    not null,
    status    varchar(20) null,
    constraint appartId_appart_id_fk
        foreign key (appartId) references apparts (id)
            on update cascade on delete cascade,
    constraint clientId_user_id_fk
        foreign key (clientId) references users (id)
            on update cascade on delete cascade
);

create table if not exists specApparts
(
    appartId     int                  not null
        primary key,
    wifi         tinyint(1) default 0 null,
    parking      tinyint(1) default 0 null,
    childAdapted tinyint(1) default 0 null,
    balcon       tinyint(1) default 0 null invisible,
    smoker       tinyint(1) default 0 null,
    constraint specApparts_apparts_id_fk
        foreign key (appartId) references apparts (id)
            on update cascade on delete cascade
);