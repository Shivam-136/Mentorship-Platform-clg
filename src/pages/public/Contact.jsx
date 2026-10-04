import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Get in Touch</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            We'd love to hear from you.
          </h1>
          <p className="text-base text-slate-600 max-w-lg mx-auto">
            Have questions about finding a mentor, enterprise plans, or onboarding as a coach? Drop us a line.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details */}
          <div className="md:col-span-5 space-y-6">
            <Card className="p-6 space-y-6 bg-slate-900 text-white border-0 shadow-lg">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Direct Channels</h3>
                <p className="text-xs text-slate-300">
                  Our team typically replies in under 4 hours during business days.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">General Inquiries</strong>
                    <span className="text-slate-300">support@mentormatch.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Mentor Relations</strong>
                    <span className="text-slate-300">mentors@mentormatch.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Headquarters</strong>
                    <span className="text-slate-300">548 Market St, San Francisco, CA 94104</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
                Operating Hours: Monday – Friday, 9:00 AM – 6:00 PM PST
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7">
            <Card className="p-6 sm:p-8">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Thank you for reaching out. A mentorship advisor will respond shortly to your email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      placeholder="Jane Doe"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="jane@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <Input
                    label="Subject"
                    placeholder="How can we help?"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Provide details about your question or inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="block w-full rounded-lg text-sm border border-slate-300 p-3 bg-white text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                    />
                  </div>

                  <Button type="submit" size="md" rightIcon={<Send className="w-4 h-4" />}>
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
}
