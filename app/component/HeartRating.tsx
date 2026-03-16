import { Heart } from "lucide-react";

interface HeartRatingProps {
    rating: number;
    size?: number;
}

export function HeartRating({ rating, size = 12 }: HeartRatingProps) {
    return (
        <span className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Heart
                    key={s}
                    size={size}
                    fill={s <= rating ? "#f472b6" : "none"}
                    stroke={s <= rating ? "#f472b6" : "#555"}
                    strokeWidth={2}
                />
            ))}
        </span>
    );
}
