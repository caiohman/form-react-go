create table if not exists categories (
    id int,
    name varchar(255),
    unique(id)
);

create table if not exists bank (
    id int,
    name varchar(21),
    total decimal(10),
    unique(id)
);

create table if not exists transactions (
    id int auto_increment,
    value int,
    instant datetime,
    categories int,
    bank int,
    foreign key(categories) references categories(id),
    foreign key(bank) references bank(id),
    unique(id)
);
