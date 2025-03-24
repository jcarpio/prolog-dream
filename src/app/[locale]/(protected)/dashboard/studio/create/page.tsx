"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CreateStudioPage() {
  const t = useTranslations('StudioPage');
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!name.trim()) {
      toast.error(t("error_studio_name_required"));
      return;
    }
    if (!type) {
      toast.error(t("error_studio_type_required"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/studio/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          type,
          images: [], // No images used anymore
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create studio');
      }

      const studio = await response.json();
      toast.success(t("success_studio_created"));
      router.push(`/dashboard/studio/${studio.id}?successNew=true`);
    } catch (error) {
      toast.error(`${t("error_failed_to_create_studio")} ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="mb-4 flex justify-start space-x-4">
        <Link href="/dashboard">
          <Button variant="outline" size="icon" className="mt-1 size-7">
            <ArrowLeft className="size-4" />
            <span className="sr-only">{t("back_to_dashboard")}</span>
          </Button>
        </Link>
        <DashboardHeader heading="Create Your Course" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardDescription>{t("enter_basic_info_for_your_studio")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">{t("studio_name")}</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder={t("your_studio_name")} 
                  className="p-2 text-sm"
                />
                <p className="text-sm text-muted-foreground">{t("this_is_the_name_that_will_be_displayed_for_your_studio")}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-base font-semibold">{t("studio_type")}</Label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger className="w-full p-2">
                    <SelectValue placeholder={t("select_studio_type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("male")}</SelectItem>
                    <SelectItem value="female">{t("female")}</SelectItem>
                    <SelectItem value="kid">{t("kid")}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">{t("select_the_type_of_studio_you_want_to_create")}</p>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 size-4 animate-spin" />
                    {t("creating")}...
                  </>
                ) : (
                  t("create_studio")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
