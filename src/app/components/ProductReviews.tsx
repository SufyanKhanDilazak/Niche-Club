// app/components/ProductReviews.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, MessageSquare, User, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Review {
  id: string;
  product_id: string;
  customer_name: string | null;
  message: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [connectionTested, setConnectionTested] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    customerName: "",
    message: "",
    rating: 0
  });
  const [formErrors, setFormErrors] = useState({
    message: "",
    rating: ""
  });

  // Enhanced error logging helper
  const logError = (context: string, error: unknown) => {
    console.error(`${context}:`, {
      error,
      message: error && typeof error === 'object' && 'message' in error ? error.message : 'No message',
      details: error && typeof error === 'object' && 'details' in error ? error.details : 'No details',
      hint: error && typeof error === 'object' && 'hint' in error ? error.hint : 'No hint',
      code: error && typeof error === 'object' && 'code' in error ? error.code : 'No code',
      full: JSON.stringify(error, null, 2)
    });
  };

  // Test Supabase connection first
  const testConnection = useCallback(async () => {
    if (connectionTested) return true;
    
    try {
      console.log('Testing Supabase connection...');
      
      // Simple connectivity test
      const { error } = await supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true })
        .limit(1);

      if (error) {
        logError('Connection test failed', error);
        
        if (error.code === 'PGRST116') {
          toast.error("Unable to connect to database. Please check your configuration.");
        } else if (error.code === '42P01') {
          toast.error("Reviews table not found. Please run the database setup SQL.");
        } else {
          toast.error(`Database connection failed: ${error.message}`);
        }
        return false;
      }
      
      setConnectionTested(true);
      console.log('Supabase connection successful');
      return true;
    } catch (error) {
      logError('Unexpected connection error', error);
      toast.error("Failed to connect to database");
      return false;
    }
  }, [connectionTested]);

  // Fetch reviews from Supabase
  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Test connection first
      const isConnected = await testConnection();
      if (!isConnected) {
        return;
      }
      
      console.log('Fetching reviews for product:', productId);
      
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) {
        logError('Error fetching reviews', error);
        
        // Handle specific error cases
        if (error.code === 'PGRST116') {
          toast.error("Database connection failed. Please check your setup.");
        } else if (error.code === '42P01') {
          toast.error("Reviews table not found. Please create the reviews table first.");
        } else if (error.code === '42501') {
          toast.error("Permission denied. Please check your RLS policies.");
        } else {
          toast.error(`Failed to load reviews: ${error.message || 'Unknown error'}`);
        }
        return;
      }

      console.log('Reviews fetched successfully:', data?.length || 0, 'reviews');
      setReviews(data || []);
    } catch (error) {
      logError('Unexpected error fetching reviews', error);
      toast.error("An unexpected error occurred while loading reviews");
    } finally {
      setIsLoading(false);
    }
  }, [productId, testConnection]);

  // Load reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Form validation
  const validateForm = () => {
    const errors = {
      message: "",
      rating: ""
    };

    if (!formData.message.trim()) {
      errors.message = "Review message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Review must be at least 10 characters long";
    }

    if (formData.rating === 0) {
      errors.rating = "Please select a rating";
    }

    setFormErrors(errors);
    return !errors.message && !errors.rating;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Test connection before submitting
      const isConnected = await testConnection();
      if (!isConnected) {
        return;
      }

      const reviewData = {
        product_id: productId,
        customer_name: formData.customerName.trim() || null,
        message: formData.message.trim(),
        rating: formData.rating
      };

      console.log('Submitting review:', reviewData);

      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()
        .single();

      if (error) {
        logError('Error submitting review', error);
        
        // Handle specific error messages
        if (error.code === 'PGRST116') {
          toast.error("Unable to connect to the database. Please try again later.");
        } else if (error.code === '42P01') {
          toast.error("Reviews table not found. Please create the reviews table first.");
        } else if (error.code === '42501') {
          toast.error("Permission denied. Please check your RLS policies allow inserts.");
        } else if (error.message && error.message.includes('violates check constraint')) {
          toast.error("Invalid rating value. Please select a rating between 1-5 stars.");
        } else if (error.code === '23505') {
          toast.error("Duplicate review detected. You may have already reviewed this product.");
        } else if (error.message && error.message.includes('rating')) {
          toast.error("Invalid rating. Please select a rating between 1-5 stars.");
        } else {
          toast.error(`Failed to submit review: ${error.message || error.code || 'Unknown error'}`);
        }
        return;
      }

      console.log('Review submitted successfully:', data);

      // Success - reset form and refresh reviews
      setFormData({
        customerName: "",
        message: "",
        rating: 0
      });
      setFormErrors({
        message: "",
        rating: ""
      });

      toast.success("Review submitted successfully! Thank you for your feedback.");
      
      // Add the new review to the beginning of the list for instant feedback
      if (data) {
        setReviews(prev => [data, ...prev]);
      }
      
    } catch (error) {
      logError('Unexpected error submitting review', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific field error when user starts typing
    if (field === 'message' && formErrors.message) {
      setFormErrors(prev => ({ ...prev, message: "" }));
    }
    if (field === 'rating' && formErrors.rating) {
      setFormErrors(prev => ({ ...prev, rating: "" }));
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch {
      return 'Invalid date';
    }
  };

  // Render star rating
  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={`${
              interactive 
                ? "hover:scale-110 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded" 
                : "cursor-default"
            }`}
            disabled={!interactive}
            aria-label={interactive ? `Rate ${star} star${star > 1 ? 's' : ''}` : undefined}
          >
            <Star
              className={`h-4 w-4 ${
                star <= rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              } ${interactive ? "hover:text-yellow-400" : ""}`}
            />
          </button>
        ))}
      </div>
    );
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white dark:text-white mb-2">
            Customer Reviews
          </h2>
          <p className="text-white dark:text-white">
            What our customers are saying about {productName}
          </p>
        </div>

        {/* Reviews Summary */}
        <div className="bg-white/50 dark:bg-black/50 border border-black/20 dark:border-white/20 rounded-2xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-3xl font-bold text-black dark:text-white mb-2">
                {averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(averageRating))}
              <p className="text-sm text-black/70 dark:text-white/70 mt-2">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter(r => r.rating === stars).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-sm text-black dark:text-white w-3">
                      {stars}
                    </span>
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-black/70 dark:text-white/70 w-8">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center gap-2 text-black dark:text-white">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading reviews...
            </div>
          </div>
        ) : reviews.length > 0 ? (
          <>
            <div className="space-y-4 mb-6">
              {displayedReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white/50 dark:bg-black/50 border border-black/20 dark:border-white/20 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-[#a90068]/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600 dark:text-[#a90068]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-black dark:text-white">
                          {review.customer_name || 'Anonymous Customer'}
                        </h4>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-black/70 dark:text-white/70">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-black dark:text-white leading-relaxed">
                    {review.message}
                  </p>
                </div>
              ))}
            </div>

            {reviews.length > 3 && (
              <div className="text-center mb-8">
                <Button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  variant="outline"
                  className="border-2 border-blue-600 dark:border-[#a90068] text-blue-600 dark:text-[#a90068] hover:bg-blue-50 dark:hover:bg-[#a90068]/10"
                >
                  {showAllReviews 
                    ? `Show Less Reviews` 
                    : `Show All ${reviews.length} Reviews`
                  }
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              No reviews yet
            </h3>
            <p className="text-white dark:text-white">
              Be the first to review {productName}
            </p>
          </div>
        )}

        <Separator className="bg-black/20 dark:bg-white/20 my-8" />

        {/* Review Form */}
        <div className="bg-white/50 dark:bg-black/50 border border-black/20 dark:border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-black dark:text-white mb-6">
            Write a Review
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                Rating *
              </label>
              <div className="flex items-center gap-2 mb-2">
                {renderStars(formData.rating, true, (rating) => handleInputChange('rating', rating))}
                <span className="text-sm text-black/70 dark:text-white/70 ml-2">
                  {formData.rating > 0 && `${formData.rating} star${formData.rating > 1 ? 's' : ''}`}
                </span>
              </div>
              {formErrors.rating && (
                <p className="text-red-500 text-sm mt-1">{formErrors.rating}</p>
              )}
            </div>

            {/* Name (Optional) */}
            <div>
              <label 
                htmlFor="customerName"
                className="block text-sm font-semibold text-black dark:text-white mb-2"
              >
                Your Name (Optional)
              </label>
              <input
                id="customerName"
                type="text"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border-2 border-black/30 dark:border-white/30 rounded-lg focus:border-blue-500 dark:focus:border-[#a90068] focus:outline-none bg-white dark:bg-black text-black dark:text-white placeholder-black/50 dark:placeholder-white/50 transition-colors"
                maxLength={100}
                disabled={isSubmitting}
              />
            </div>

            {/* Review Message */}
            <div>
              <label 
                htmlFor="reviewMessage"
                className="block text-sm font-semibold text-black dark:text-white mb-2"
              >
                Your Review *
              </label>
              <textarea
                id="reviewMessage"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-black/30 dark:border-white/30 rounded-lg focus:border-blue-500 dark:focus:border-[#a90068] focus:outline-none bg-white dark:bg-black text-black dark:text-white placeholder-black/50 dark:placeholder-white/50 transition-colors resize-none"
                maxLength={1000}
                required
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-2">
                {formErrors.message && (
                  <p className="text-red-500 text-sm">{formErrors.message}</p>
                )}
                <span className="text-sm text-black/70 dark:text-white/70 ml-auto">
                  {formData.message.length}/1000
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-[#a90068] dark:hover:bg-[#8a0055] text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting Review...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Submit Review
                </div>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}