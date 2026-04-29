import { IconCloud } from "@tabler/icons-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function EmptyOutline() {
  return (
    <Empty className="border border-dashed mt-50">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCloud />
        </EmptyMedia>
        <EmptyTitle>This is waiting page</EmptyTitle>
        <EmptyDescription>
          Ask to admin to give you access to the system, or wait until your account is activated.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
