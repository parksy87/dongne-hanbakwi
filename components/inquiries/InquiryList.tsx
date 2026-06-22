"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import { Inquiry } from "@/types";
import { INQUIRY_STATUS_LABELS } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InquiryListProps {
  inquiries: Inquiry[];
}

function formatInquiryDate(inquiry: Inquiry): string {
  const date = inquiry.createdAt?.toDate?.();
  if (!date) return "";
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

export default function InquiryList({ inquiries }: InquiryListProps) {
  if (inquiries.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-500 py-10 leading-relaxed">
          아직 문의 내역이 없습니다.
          <br />
          궁금한 점이 있으면 문의해 주세요.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {inquiries.map((inquiry) => (
        <Link key={inquiry.id} href={`/inquiries/${inquiry.id}`}>
          <Card className="hover:bg-gray/50 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-full",
                      inquiry.status === "answered"
                        ? "bg-success/20 text-success"
                        : "bg-gray text-gray-500"
                    )}
                  >
                    {INQUIRY_STATUS_LABELS[inquiry.status]}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatInquiryDate(inquiry)}
                  </span>
                </div>
                <p className="font-bold text-secondary truncate">
                  {inquiry.title}
                </p>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {inquiry.content}
                </p>
              </div>
              <ChevronRight size={18} className="text-gray-400 shrink-0 mt-1" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
