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
  ComboboxList
} from "@/components/ui/combobox"
import CategoriesData from "./CategoriesData"
import { useState, useEffect } from "react";
import BankProp from "./BankProp"
import Bank from "./Bank"

export default function NewTransaction({banks} : BankProp) {
  const [categoriestData, setCategoriesData] = useState<CategoriesData[]>([]);
  const [bankSelected, setBankSelected] = useState<Bank>({ id: 0, name: '', total: 0 })
  const [valueSelected, setValueSelected] = useState<string>('')
  const [categorySelected, setCategorySelected] = useState<CategoriesData>({ id : 0,  name : ''})

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

  const submitClick = () => {
    if (bankSelected.id !== 0 && categorySelected.id !== 0 && Number(valueSelected) !== 0) {
      fetch("http://localhost:8090/setnewtransaction", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({value: valueSelected, bank: bankSelected.id, category: categorySelected.id})
      })
    }
  }

  return (
    <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">New Transaction</Button>
    </PopoverTrigger>
    <PopoverContent>
      <PopoverHeader>
      </PopoverHeader>
      <FieldGroup className="gap-4">
        <Field orientation="horizontal">
          <FieldLabel htmlFor="value" className="w-1/2">
            Value
          </FieldLabel>
          <Input id="value" value={valueSelected} onChange={ (newValue) => setValueSelected(newValue.target.value)}/>
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="bank" className="w-1/2">
            Bank
          </FieldLabel>
          <Combobox id="bank"
              items={banks}
              value={bankSelected}
              onValueChange={(newValue) => { if ( newValue != null) setBankSelected(newValue) }  }
              itemToStringValue={(item) => item.name}>
                <ComboboxInput value={(bankSelected.name)}/>
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
              value={categorySelected}
              onValueChange={(newValue) => { if ( newValue != null) setCategorySelected(newValue) }  }
              itemToStringValue={(item) => item.name}>
                <ComboboxInput value={(categorySelected.name)}/>
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
          <Button onClick={submitClick}>Submit</Button>
      </FieldGroup>
    </PopoverContent>
  </Popover>

 )
}
