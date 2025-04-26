"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import BankCard from "./bankCard";
import Bank from "./Bank";

export default function Home() {
  const [valueTotal, setValueTotal] = useState(0);
  const [banks, setValueBank] = useState<Bank[]>([]);

  useEffect(() => {
    fetch("http://localhost:8090/getbanks")
      .then((res) => res.json())
      .then((json) => {
        let sum = 0;
        for (const element of json) {
          sum += element.total;
          const newBank: Bank = {
            id: element.id,
            name: element.name,
            total: element.total,
          };
          setValueBank((current) => [...current, newBank]);
        }
        setValueTotal(sum);
      });
  }, []);

  return (
    <section id="cards" className="flex flex-row">
      <Card className="w-1/6">
        <CardHeader>
          <CardTitle>Total Available</CardTitle>
          <CardDescription>
            Sum of all money available: {valueTotal}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>Details</Button>
        </CardFooter>
      </Card>
      {banks.length > 0 ? (
        banks.map((bank) => (
          <BankCard key={bank.id} name={bank.name} total={bank.total} />
        ))
      ) : (
        <BankCard name={"None"} total={0} />
      )}
    </section>
  );
}
