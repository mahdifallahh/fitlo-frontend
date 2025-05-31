import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DataTable } from "@/components/ui/data-table"

// Form validation schema
const exerciseFormSchema = z.object({
  name: z.string().min(2, "نام تمرین باید حداقل 2 حرف باشد"),
  category: z.string().min(1, "لطفا دسته‌بندی را انتخاب کنید"),
  difficulty: z.string().min(1, "لطفا سطح دشواری را انتخاب کنید"),
  description: z.string().min(10, "توضیحات باید حداقل 10 حرف باشد"),
  equipment: z.string().optional(),
  videoUrl: z.string().url("لینک ویدیو باید معتبر باشد").optional(),
})

type ExerciseFormValues = z.infer<typeof exerciseFormSchema>

type Exercise = {
  id: number
  name: string
  category: string
  difficulty: string
  equipment: string
}

// Mock data for exercises
const mockExercises: Exercise[] = [
  {
    id: 1,
    name: "پرس سینه",
    category: "قدرتی",
    difficulty: "متوسط",
    equipment: "دمبل",
  },
  {
    id: 2,
    name: "اسکات",
    category: "قدرتی",
    difficulty: "مبتدی",
    equipment: "بدون تجهیزات",
  },
  {
    id: 3,
    name: "پلانک",
    category: "تعادل",
    difficulty: "مبتدی",
    equipment: "بدون تجهیزات",
  },
]

const columns = [
  {
    header: "نام تمرین",
    accessorKey: "name" as const,
  },
  {
    header: "دسته‌بندی",
    accessorKey: "category" as const,
  },
  {
    header: "سطح دشواری",
    accessorKey: "difficulty" as const,
  },
  {
    header: "تجهیزات",
    accessorKey: "equipment" as const,
  },
]

export default function Exercises() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: {
      name: "",
      category: "",
      difficulty: "",
      description: "",
      equipment: "",
      videoUrl: "",
    },
  })

  async function onSubmit(data: ExerciseFormValues) {
    setIsSubmitting(true)
    try {
      // TODO: Implement API call to save exercise
      console.log(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredExercises = mockExercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>مدیریت تمرینات</CardTitle>
          <CardDescription>
            تمرینات جدید را اضافه کنید و لیست تمرینات موجود را مدیریت کنید
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <DataTable
            data={filteredExercises}
            columns={columns}
            searchable={true}
            searchPlaceholder="جستجوی تمرین..."
            onSearch={setSearchQuery}
            currentPage={currentPage}
            totalPages={Math.ceil(filteredExercises.length / 5)}
            onPageChange={setCurrentPage}
            emptyMessage="هیچ تمرینی یافت نشد"
          />
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>افزودن تمرین جدید</CardTitle>
          <CardDescription>
            اطلاعات تمرین جدید را وارد کنید
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">نام تمرین</Label>
              <Input
                id="name"
                placeholder="نام تمرین را وارد کنید"
                {...form.register("name")}
                className="text-right"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">دسته‌بندی</Label>
              <Select
                onValueChange={(value) => form.setValue("category", value)}
                defaultValue={form.getValues("category")}
              >
                <SelectTrigger id="category" className="text-right bg-white dark:bg-gray-900">
                  <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength" className="text-right">قدرتی</SelectItem>
                  <SelectItem value="cardio" className="text-right">کاردیو</SelectItem>
                  <SelectItem value="flexibility" className="text-right">انعطاف‌پذیری</SelectItem>
                  <SelectItem value="balance" className="text-right">تعادل</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">سطح دشواری</Label>
              <Select
                onValueChange={(value) => form.setValue("difficulty", value)}
                defaultValue={form.getValues("difficulty")}
              >
                <SelectTrigger id="difficulty" className="text-right bg-white dark:bg-gray-900">
                  <SelectValue placeholder="سطح دشواری را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner" className="text-right">مبتدی</SelectItem>
                  <SelectItem value="intermediate" className="text-right">متوسط</SelectItem>
                  <SelectItem value="advanced" className="text-right">پیشرفته</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.difficulty && (
                <p className="text-sm text-red-500">{form.formState.errors.difficulty.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">توضیحات</Label>
              <Textarea
                id="description"
                placeholder="توضیحات تمرین را وارد کنید"
                {...form.register("description")}
                className="text-right min-h-[100px]"
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment">تجهیزات مورد نیاز</Label>
              <Input
                id="equipment"
                placeholder="تجهیزات مورد نیاز را وارد کنید"
                {...form.register("equipment")}
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">لینک ویدیو</Label>
              <Input
                id="videoUrl"
                placeholder="لینک ویدیو را وارد کنید"
                {...form.register("videoUrl")}
                className="text-right"
              />
              {form.formState.errors.videoUrl && (
                <p className="text-sm text-red-500">{form.formState.errors.videoUrl.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "در حال ذخیره..." : "ذخیره تمرین"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 