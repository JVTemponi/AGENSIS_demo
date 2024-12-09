import { Skeleton } from "@/components/ui/skeleton"
import { Presentation, BriefcaseBusiness } from 'lucide-react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { Separator } from "@/components/ui/separator"

interface AreaoverviewProps {
  loading: boolean;
}

export default function Areaoverview({ loading }: AreaoverviewProps) {
  return (
    <>
      <div className="mb-2 mr-2">
        {loading ? (
          <Skeleton className="h-10 w-[125px]" />
        ) : (
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Tarefas do dia
          </h2>
        )}
        <div className="flex mt-2 space-x-3">
          <div className="container">
            {loading ? (
              <>
                <Skeleton className="h-[75px] w-full rounded-xl mb-2" />
                <Skeleton className="h-[75px] w-full rounded-xl mb-2" />
                <Skeleton className="h-[75px] w-full rounded-xl mb-2" />
              </>
            ) : (
              <>
                <a href="">
                  <Alert className="mb-2">
                    <Presentation className="h-4 w-4" />
                    <AlertTitle>Empresa 1</AlertTitle>
                    <AlertDescription>Reunião online</AlertDescription>
                  </Alert>
                </a>
                <a href="">
                  <Alert className="mb-2">
                    <Presentation className="h-4 w-4" />
                    <AlertTitle>Empresa 2</AlertTitle>
                    <AlertDescription>Rua da reunião 1</AlertDescription>
                  </Alert>
                </a>
                <a href="">
                  <Alert className="mb-2">
                    <Presentation className="h-4 w-4" />
                    <AlertTitle>Empresa 3</AlertTitle>
                    <AlertDescription>Google Meet</AlertDescription>
                  </Alert>
                </a>
              </>
            )}
          </div>

          <Separator orientation="vertical" />

          <div className="container">
            {loading ? (
              <>
                <Skeleton className="h-[75px] w-full rounded-xl mb-2" />
                <Skeleton className="h-[75px] w-full rounded-xl mb-2" />
                <Skeleton className="h-[75px] w-full rounded-xl mb-2" />
              </>
            ) : (
              <>
                <a href="">
                  <Alert className="mb-2">
                    <BriefcaseBusiness className="h-4 w-4" />
                    <AlertTitle>Empresa 1</AlertTitle>
                    <AlertDescription>Post Instagram</AlertDescription>
                  </Alert>
                </a>
                <a href="">
                  <Alert className="mb-2">
                    <BriefcaseBusiness className="h-4 w-4" />
                    <AlertTitle>Empresa 2</AlertTitle>
                    <AlertDescription>Logo</AlertDescription>
                  </Alert>
                </a>
                <a href="">
                  <Alert className="mb-2">
                    <BriefcaseBusiness className="h-4 w-4" />
                    <AlertTitle>Empresa 3</AlertTitle>
                    <AlertDescription>Blog post</AlertDescription>
                  </Alert>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
