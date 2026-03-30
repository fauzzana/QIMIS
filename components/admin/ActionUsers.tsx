import { toast } from "sonner"
import { z } from "zod"

export const schema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  role: z.enum(["ADMIN", "MANAGEMENT", "STAFF"]),
  userId: z.string().nullable(),
  department: z.object({
    depart_name: z.string().nullable(),
  }).nullable(),
})

type User = z.infer<typeof schema> & {
  department: { department_name: string }
}

export function handleEdit(user: User) {
  return async (updateData?: { name: string; role: "ADMIN" | "MANAGEMENT" | "STAFF"; department_name: string }) => {
    try {
      const dataToSend = updateData || {
        name: user.name || "",
        role: user.role,
        department_name: user.department?.depart_name || "",
      }

      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      })
      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Gagal mengubah user")
        return
      }
      const result = await response.json()
      toast.success("User updated successfully")

      // Refresh page untuk update data terbaru
      window.location.reload()
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("An error occurred while updating the user")
    }
  }
}

export function handleDelete(userId: string) {
  return async () => {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "DELETE",
      })
    } catch (error) {
      toast.error("Gagal menghapus user")
      return
    }
  }
}