import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface AlertDestructiveProps {
  Errotitle: string;
  errodescription: string;
}

export function AlertDestructive({ Errotitle, errodescription }: AlertDestructiveProps) {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>{Errotitle}</AlertTitle>
      <AlertDescription>
        {errodescription}
      </AlertDescription>
    </Alert>
  )
}
