// components/cards/LiveClassCard.tsx
import React from "react";
import { Clock, Calendar, Video, Eye, BookOpen, Award, Image } from "lucide-react";
import Link from "next/link";
import { LiveClassCardProps } from "@/types/classes";
import { PriceDisplay } from "../ui/PriceDisplay";

const LiveClassCard = ({ classItem }: LiveClassCardProps) => {
  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-primary/50">
      {/* Class Image Section */}
      <div className="relative h-52 overflow-hidden bg-linear-to-br from-purple-100 to-indigo-100">
        {classItem.image_url ? (
          <img
            src={classItem.image_url}
            alt={classItem.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 flex justify-center items-center">
            <Image className="size-12 text-primary/50"/>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

        {/* Class Meta Badges */}
        <div className="absolute bottom-4 left-4 flex gap-2 z-10">
          <div className="bg-black/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {classItem?.total_classes} Classes
          </div>
          <div className="bg-black/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {classItem?.duration_in_days} Days
          </div>
          <div className="bg-red-500 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <Video className="w-3 h-3" />
            Live
          </div>
        </div>
      </div>

      {/* Class Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {classItem?.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {classItem?.description}
        </p>

        {/* Quick Info */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-2.5 text-sm text-gray-700 bg-primary/5 p-2.5 rounded-xl">
            <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-medium">
              {classItem?.total_classes} Interactive Sessions
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-gray-700 bg-primary/5 p-2.5 rounded-xl">
            <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-medium">
              {classItem?.duration_in_days} Days Duration
            </span>
          </div>
        </div>

        {/* Certificate Badge */}
        <div className="flex items-center gap-2 mb-4 p-2 bg-green-50 rounded-lg">
          <Award className="w-4 h-4 text-green-600" />
          <span className="text-xs font-medium text-green-700">
            Certificate of Completion
          </span>
        </div>

        {/* Price Section */}
        <div className="border-t border-gray-100 pt-4 mb-4">
          <div className="flex justify-between">
            <div className="flex justify-between w-full">
              <p className="text-xl text-gray-500 mb-1">Course Investment:</p>

              <span className="text-3xl font-extrabold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                ${classItem?.price}
                {/* <PriceDisplay amountUSD={Number(classItem?.price)}/> */}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/classes/${classItem?.id}`}
          className="w-full bg-linear-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 transition-all duration-300 active:scale-98 shadow-md hover:shadow-xl flex items-center justify-center gap-2 font-semibold text-white rounded-full py-3"
        >
          <BookOpen className="w-4 h-4" />
          View Batches
        </Link>
      </div>
    </div>
  );
};

export default LiveClassCard;
