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
import { ChevronRight, ChevronLeft } from "lucide-react";
import BankChart from "./bankChart";

export default function Home() {
  const [valueTotal, setValueTotal] = useState(0);
  const [banks, setValueBank] = useState<Bank[]>([]);
  const [details, setDetailsValue] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8090/getbanks")
      .then((res) => res.json())
      .then((json) => {
        let sum = 0;
        if (json !== null) {
          for (const element of json) {
            sum += element.total;
            const newBank: Bank = {
              id: element.id,
              name: element.name,
              total: element.total,
            };
            setValueBank((current) => [...current, newBank]);
          }
        }

        setValueTotal(sum);
      });
  }, []);

  return (
    <div>
      <section id="cards" className="flex flex-row">
        <Card className="w-1/6">
          <CardHeader>
            <CardTitle>Total Available</CardTitle>
            <CardDescription>
              Sum of all money available: {valueTotal}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            {details === false ? (
              <Button
                onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                  console.log(event.target);
                  setDetailsValue(true);
                }}
              >
                {" "}
                Details
                <ChevronRight />
              </Button>
            ) : (
              <Button
                onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                  console.log(event.target);
                  setDetailsValue(false);
                }}
              >
                <ChevronLeft /> Hide
              </Button>
            )}
          </CardFooter>
        </Card>
        {banks.length > 0 && details == true
          ? banks.map((bank) => (
              <BankCard key={bank.id} name={bank.name} total={bank.total} />
            ))
          : true}
      </section>
      <section id="chart" className="flex flex-row justify-center">
        <BankChart />
      </section>
    </div>
  );
}
