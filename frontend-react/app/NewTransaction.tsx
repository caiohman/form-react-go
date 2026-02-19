import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import CategoriesData from "./CategoriesData"
import { useState, useEffect } from "react";
import BankProp from "./BankProp"

export default function NewTransaction({banks} : BankProp) {
  const [categoriestData, setCategoriesData] = useState<CategoriesData[]>([]);

  useEffect(() => {
    fetch("http://localhost:8090/getcategories")
      .then((res) => res.json())
      .then((json) => {
        for (const element of json) {
          const newCategoryData: CategoriesData = {
            id: element.id,
            name: element.name
          };
          setCategoriesData((current) => [...current, newCategoryData]);
        }
      });
  }, []);

  return (
    <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">New Transaction</Button>
    </PopoverTrigger>
    <PopoverContent>
      <PopoverHeader>
        {/*<PopoverTitle>New </PopoverTitle>
        <PopoverDescription>Description text here.</PopoverDescription>*/}
      </PopoverHeader>
      <FieldGroup className="gap-4">
        <Field orientation="horizontal">
          <FieldLabel htmlFor="value" className="w-1/2">
            Value
          </FieldLabel>
          <Input id="value"/>
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="bank" className="w-1/2">
            Bank
          </FieldLabel>
            <Combobox id="bank"
              items={banks}
              itemToStringValue={(item) => item.name}>
              <ComboboxInput />
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
          </Combobox>
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="category" className="w-1/2">
            Category
          </FieldLabel>
            <Combobox id="category"
              items={categoriestData}
              itemToStringValue={(item) => item.name}>
                <ComboboxInput />
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
          </Combobox>
          </Field>
          <Button>Submit</Button>
      </FieldGroup>
    </PopoverContent>
  </Popover>

 )
}
