import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Bank from "./Bank";

export default function BankCard({ name, total }: Bank) {
  return (
    <Card className="w-1/6">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>Money available: {total}</CardDescription>
      </CardHeader>
      <CardFooter></CardFooter>
    </Card>
  );
}
