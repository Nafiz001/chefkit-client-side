import Link from "next/link";
import Image from "next/image";
import { Clock, Users, TrendingUp } from "lucide-react";

export default function MealKitCard({ mealKit, showChef = true }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden shrink-0">
        <Image
          src={mealKit.image}
          alt={mealKit.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
              mealKit.difficulty
            )}`}
          >
            {mealKit.difficulty}
          </span>
        </div>
        {mealKit.dietaryTags && mealKit.dietaryTags.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-1">
            {mealKit.dietaryTags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col grow">
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 grow">
            {mealKit.title}
          </h3>
          <span className="text-xl font-bold text-orange-600 whitespace-nowrap shrink-0">
            ${mealKit.price}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{mealKit.shortDescription}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{mealKit.prepTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 md:w-4 md:h-4" />
            <span>{mealKit.servings} servings</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            <span>{mealKit.cuisine}</span>
          </div>
        </div>

        {showChef && mealKit.chef && (
          <p className="text-xs text-gray-500 mb-3 md:mb-4">By {mealKit.chef}</p>
        )}

        <Link
          href={`/meal-kits/${mealKit.id}`}
          className="block w-full text-center bg-linear-to-r from-orange-500 to-red-500 text-white px-4 py-2.5 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
