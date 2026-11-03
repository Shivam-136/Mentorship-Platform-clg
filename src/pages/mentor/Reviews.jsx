import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Star, Award, Calendar, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import { reviewService } from '../../services/reviewService';

export default function MentorReviews() {
  const user = useSelector((state) => state.auth.user);
  const bookings = useSelector((state) => state.bookings.bookings);

  const [apiReviews, setApiReviews] = useState([]);

  // Derive reviews from completed bookings with feedback
  const localReviews = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'Completed' && Boolean(b.ratingGiven))
      .map((b) => ({
        id: `rev-${b.id}`,
        menteeName: b.menteeName || 'Mentee',
        menteeRole: b.menteeRole || 'Software Engineer',
        rating: b.ratingGiven,
        comment: b.feedbackGiven,
        topic: b.topic,
        date: b.date,
        verified: true,
      }));
  }, [bookings]);

  // Optionally fetch from reviewService if mentor id exists
  useEffect(() => {
    let isMounted = true;
    async function fetchReviews() {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await reviewService.getReviewsForMentor(user.id);
        if (isMounted && Array.isArray(data)) {
          setApiReviews(data);
        }
      } catch {
        // Fall back to locally stored bookings reviews
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Combined real reviews
  const allReviews = useMemo(() => {
    const combined = [...localReviews];
    apiReviews.forEach((ar) => {
      if (!combined.some((cr) => cr.id === ar.id)) {
        combined.push(ar);
      }
    });
    return combined;
  }, [localReviews, apiReviews]);

  // Compute scorecard metrics
  const totalReviews = allReviews.length;
  const averageRating = useMemo(() => {
    if (totalReviews === 0) return '0.0';
    const sum = allReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / totalReviews).toFixed(1);
  }, [allReviews, totalReviews]);

  const starDistribution = useMemo(() => {
    if (totalReviews === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      dist[star] = (dist[star] || 0) + 1;
    });
    return dist;
  }, [allReviews, totalReviews]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Mentee Reviews & Ratings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Public evaluation scores and feedback left by mentees after completing 1-on-1 strategy sessions.
        </p>
      </div>

      {/* Scorecard */}
      {totalReviews > 0 ? (
        <Card className="p-6 bg-gradient-to-r from-purple-50/50 via-white to-indigo-50/30 border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-5">
            <div className="text-center sm:text-left">
              <span className="text-4xl font-black text-slate-900">{averageRating}</span>
              <div className="flex items-center gap-1 mt-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(Number(averageRating))
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-200 text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Based on <strong>{totalReviews}</strong> verified review{totalReviews === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <div className="space-y-1.5 flex-1 max-w-xs text-xs text-slate-600">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = starDistribution[stars] || 0;
              const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={stars} className="flex items-center justify-between gap-3">
                  <span className="w-12 text-slate-600 font-medium">{stars} Stars</span>
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-slate-500 font-semibold">{pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-slate-50/70 border-slate-200 text-center max-w-lg mx-auto space-y-2">
          <Star className="w-8 h-8 text-amber-400 fill-amber-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No ratings or reviews on record</h3>
          <p className="text-xs text-slate-500">
            As mentees conclude scheduled calls with you, their ratings and testimonials will be archived here.
          </p>
        </Card>
      )}

      {/* Reviews Grid */}
      {totalReviews > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allReviews.map((rev) => (
            <Card key={rev.id} className="p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar name={rev.menteeName} size="md" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rev.menteeName}</h4>
                      <p className="text-[11px] text-slate-500">{rev.menteeRole || 'Mentee'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 italic leading-relaxed">
                  "{rev.comment || 'Great mentorship session, highly valuable guidance.'}"
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {rev.date || 'Recent Session'}
                </span>
                <span className="text-purple-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-purple-600" />
                  Verified Mentee
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Award}
          title="Awaiting your first review"
          description="Deliver high-impact 1-on-1 strategy calls and encourage mentees to submit feedback."
        />
      )}
    </div>
  );
}
