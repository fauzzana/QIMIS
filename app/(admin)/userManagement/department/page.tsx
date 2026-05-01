import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DepartmentTable } from "@/components/admin/DepartTable";
import { PageHeader } from "@/components/layout/PageHeader"

async function getDepaertment() {
  const department = await prisma.department.findMany({
    select: {
      depart_id: true,
      depart_name: true,
    },
    orderBy: {
      depart_id: "desc",
    }
  })
  return department;
}

export default async function statusDepartmentsPage() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    redirect("/");
  }

  const depart = await getDepaertment()

  return (
    <div className="flex flex-3 flex-col">
      <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white z-10">
        <PageHeader items={[
          { label: "Dashboard", href: "/" },
          { label: "User Management", href: "/userManagement" },
          { label: "Department" }
        ]}
        />
      </header>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">User Management - Departments</h1>
            <p className="text-muted-foreground">
              View and manage all departments in the system
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <DepartmentTable data={depart} />
          </div>
        </div>
      </div>
    </div>
  )
}