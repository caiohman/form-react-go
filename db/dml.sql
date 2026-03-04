create trigger alter_bank_total
after insert on transactions
for each row
begin
	update bank as b set b.total = b.total - new.value where b.id = new.bank;
end;
