"use client";

import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, Clock, Tag, User, CalendarClock } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  thumbnail?: string;
  thamble?: string;
  eventType?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ViewEventDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
}

export default function ViewEventDetailsModal({
  open,
  onOpenChange,
  event,
}: ViewEventDetailsModalProps) {
  if (!event) return null;

  const imageSrc = event.thumbnail || event.thamble || "/placeholder-event.jpg";

  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, "EEEE, MMMM dd, yyyy");

  const createdAt = new Date(event.createdAt);
  const updatedAt = new Date(event.updatedAt);

  const cleanDescription = event.description.replace(/<[^>]+>/g, "").trim() || "No description available";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header with image */}
        <div className="relative h-64 w-full">
          <Image
            src={imageSrc}
            alt={event.title}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              {event.title}
            </h2>
            {event.eventType && (
              <Badge 
                variant="secondary" 
                className="mt-2 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              >
                {event.eventType}
              </Badge>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-2xl">{event.title}</DialogTitle>
            <DialogDescription className="text-base">
              {formattedDate}
              {event.time && ` • ${event.time}`}
            </DialogDescription>
          </DialogHeader>

          <Separator />

          {/* Main Content */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column - Description */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-primary" />
                  Event Details
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {cleanDescription}
                </p>
              </div>
            </div>

            {/* Right Column - Metadata */}
            <div className="space-y-6">
              <div className="bg-muted/40 p-5 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Event Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">{formattedDate}</p>
                    </div>
                  </div>

                  {event.time && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Time</p>
                        <p className="text-sm text-muted-foreground">{event.time}</p>
                      </div>
                    </div>
                  )}

                  {event.eventType && (
                    <div className="flex items-start gap-3">
                      <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Category</p>
                        <p className="text-sm text-muted-foreground">{event.eventType}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* System Info */}
              <div className="bg-muted/30 p-4 rounded-lg text-sm">
                {/* <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Created by:</span>
                  <span className="font-mono text-xs text-muted-foreground truncate">
                    {event.createdBy}
                  </span>
                </div> */}
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <p className="text-xs">Created:</p>
                    <p className="text-xs">{format(createdAt, "PPp")}</p>
                  </div>
                  <div>
                    <p className="text-xs">Last updated:</p>
                    <p className="text-xs">{format(updatedAt, "PPp")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}