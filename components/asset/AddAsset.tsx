"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { handleInsert, type InsertFormData } from "./ActionAsset"

type FormData = InsertFormData;

const formSchema = z.object({
  serial: z.string().min(5, "Serial number must be at least 5 characters."),
  name: z.string().optional(),
  description: z.string().optional(),
  category_id: z.string().min(1, "Category harus dipilih"),
  location_id: z.string().min(1, "Location harus dipilih"),
  qty: z.coerce.number().min(1, "Qty harus lebih dari 0"),
  purcase_date: z.string().refine((d) => !Number.isNaN(Date.parse(d)), {
    message: "Tanggal tidak valid",
  }),
  purcase_price: z.coerce.number().min(0, "Purchase price tidak boleh negatif"),
  status: z.enum(["1", "2", "3", "4"]),
  image: z.string().optional(),
}) satisfies z.ZodType<FormData>;

type Category = { category_id: string; category_name: string }
type Location = { location_id: string; location_name: string }

export function AddAssetForm() {
  const form = useForm<FormData>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      serial: "",
      name: "",
      description: "",
      category_id: "",
      location_id: "",
      qty: 1,
      purcase_date: new Date().toISOString().substring(0, 10),
      purcase_price: 0,
      status: "1",
      image: "",
    },
  })

  const [categories, setCategories] = React.useState<Category[]>([])
  const [locations, setLocations] = React.useState<Location[]>([])

  React.useEffect(() => {
    async function loadOptions() {
      try {
        const [catRes, locRes] = await Promise.all([
          fetch("/api/category"),
          fetch("/api/location"),
        ])

        if (!catRes.ok || !locRes.ok) {
          throw new Error("Failed fetch category/location")
        }

        const catData = await catRes.json()
        const locData = await locRes.json()

        setCategories(catData.data || [])
        setLocations(locData.data || [])
      } catch (error) {
        console.error("Error loading category/location", error)
        toast.error("Gagal memuat kategori/lokasi")
      }
    }

    loadOptions()
  }, [])

  async function onSubmit(data: FormData) {
    const insertFn = handleInsert(data)
    const result = await insertFn()
    if (result) {
      form.reset()
      window.location.reload()
    }
  }

  return (
    <div>
      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 mb-2">
              <Controller
                name="serial"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Serial Number</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Serial asset"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="p-2 mb-2">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Name</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Nama asset"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="p-2 mb-2">
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Description</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        placeholder="Deskripsi asset"
                        rows={4}
                        className="min-h-24 resize-none"
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="p-2 mb-2">
              <Controller
                name="category_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Category</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.category_id} value={c.category_id}>
                            {c.category_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="p-2 mb-2">
              <Controller
                name="location_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Location</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc.location_id} value={loc.location_id}>
                            {loc.location_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="p-2 mb-2">
              <Controller
                name="qty"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Quantity</FieldLabel>
                    <Input {...field} type="number" min={1} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="p-2 mb-2">
              <Controller
                name="purcase_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Purchase Date</FieldLabel>
                    <Input {...field} type="date" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="p-2 mb-2">
              <Controller
                name="purcase_price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Purchase Price</FieldLabel>
                    <Input {...field} type="text" placeholder="0" inputMode="numeric" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="p-2 mb-2">
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Status</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Available</SelectItem>
                        <SelectItem value="2">In Use</SelectItem>
                        <SelectItem value="3">Maintenance</SelectItem>
                        <SelectItem value="4">Unused</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="p-2 mb-2">
              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Image</FieldLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            field.onChange(reader.result)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
        </FieldGroup>
      </form>

      <Separator />

      <div className="p-3 mt-2">
        <Field className="flex justify-end" orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>
        </Field>
      </div>
    </div>
  )
}
