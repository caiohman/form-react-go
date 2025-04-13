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

export default function Home() {
  const [valueTotal, setValueTotal] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8090/getbanks")
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        let sum = 0;
        for (const element of json) {
          sum += element.total;
        }
        setValueTotal(sum);
      });
  }, []);

  return (
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
  );
}
