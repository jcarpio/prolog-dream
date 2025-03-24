import { DashboardHeader } from "@/components/dashboard/header";
import { Separator } from "@/components/ui/separator";
import CTA from "@/components/sections/CTA";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

interface RunPageProps {
  params: {
    id: string;
  };
}

export default async function RunPage({ params }: RunPageProps) {
  const session = await auth();
  if (!session?.user) {
    return redirect("/login");
  }

  const studio = await prisma.studio.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!studio) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex h-full flex-col space-y-4 p-2 md:p-4 lg:p-6">
      <DashboardHeader
        heading={studio.name}
        text={"Resuelve los ejercicios de este curso. Elige un reto y comienza a entrenar tu mente lógica."}
      />
      <Separator />
      <div className="flex-1 overflow-hidden rounded-xl border bg-background p-2 shadow-lg md:p-4">
        <CTA />
      </div>
    </div>
  );
}
