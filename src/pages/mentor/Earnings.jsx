import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  Download,
  CheckCircle2,
  Clock,
  Building,
  Plus,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { setPayoutMethod } from '../../store/slices/earningsSlice';
import useToast from '../../utils/useToast';
import { formatCurrency } from '../../utils/helpers';

export default function MentorEarnings() {
  const dispatch = useDispatch();
  const toast = useToast();

  const { transactions, payoutMethod } = useSelector((state) => state.earnings);
  const bookings = useSelector((state) => state.bookings.bookings);

  // Compute actual completed earnings from confirmed/completed user bookings & transactions
  const completedBookings = bookings.filter((b) => b.status === 'Completed');
  const computedGross =
    transactions.reduce((acc, t) => acc + (t.amount || 0), 0) +
    completedBookings.reduce((acc, b) => acc + (b.price || 0), 0);

  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [bankData, setBankData] = useState({
    accountName: payoutMethod?.accountName || '',
    accountNumber: payoutMethod?.accountNumber || '',
    bankName: payoutMethod?.bankName || '',
    routingNumber: payoutMethod?.routingNumber || '',
  });

  const handleSavePayoutMethod = (e) => {
    e.preventDefault();
    if (!bankData.accountName.trim() || !bankData.accountNumber.trim()) {
      toast.warning('Please enter valid account details.');
      return;
    }

    dispatch(
      setPayoutMethod({
        accountName: bankData.accountName.trim(),
        bankName: bankData.bankName.trim() || 'Direct Deposit',
        accountNumber: `•••• ${bankData.accountNumber.slice(-4) || '0000'}`,
        status: 'Verified',
        updatedAt: new Date().toISOString(),
      })
    );

    toast.success('Payout method successfully linked.', 'Account Updated');
    setIsPayoutModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Earnings & Payouts</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor mentorship revenues, fee distributions, and scheduled bank transfers.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsPayoutModalOpen(true)}
          leftIcon={<CreditCard className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          {payoutMethod ? 'Manage Payout Account' : 'Set Up Payout Account'}
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Lifetime Earnings</span>
            <p className="text-2xl font-black text-slate-900">
              {formatCurrency(computedGross)}
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Completed Paid Calls</span>
            <p className="text-2xl font-black text-slate-900">
              {completedBookings.length + transactions.length}
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-slate-500 font-medium">Payout Method</span>
            <p className="text-sm font-bold text-slate-900 truncate">
              {payoutMethod ? `${payoutMethod.bankName} (${payoutMethod.accountNumber})` : 'Not connected'}
            </p>
          </div>
        </Card>
      </div>

      {/* Payout Information Notice Card */}
      <Card className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
              Automated Transfers
            </Badge>
            <span className="text-xs text-slate-300">Bi-weekly settlement schedule</span>
          </div>
          <h3 className="text-sm font-bold">Standard 10% Platform Fee</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
            Mentorship payouts are automatically deposited into your connected bank account 48 hours after each session is completed.
          </p>
        </div>
      </Card>

      {/* Transactions Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Transaction History</h3>
        </div>

        {transactions.length > 0 || completedBookings.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Mentee / Topic</th>
                  <th className="py-3 px-4">Gross Fee</th>
                  <th className="py-3 px-4">Net Payout</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {completedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{b.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{b.menteeName || 'Mentee'}</div>
                      <div className="text-[11px] text-slate-500 font-normal truncate max-w-xs">{b.topic}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">${b.price || 0}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">${Math.round((b.price || 0) * 0.9)}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant="success" size="sm">
                        Settled
                      </Badge>
                    </td>
                  </tr>
                ))}
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{t.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{t.description || 'Mentorship Call'}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">${t.amount || 0}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">${Math.round((t.amount || 0) * 0.9)}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant="purple" size="sm">
                        {t.status || 'Paid'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={DollarSign}
            title="No earnings history recorded yet"
            description="When you complete 1-on-1 calls with mentees, earnings statements and automated transfers will appear here."
          />
        )}
      </div>

      {/* Payout Method Modal */}
      <Modal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        title="Payout Account Setup"
        description="Link your bank account to receive direct deposits for completed sessions."
      >
        <form onSubmit={handleSavePayoutMethod} className="space-y-4">
          <Input
            label="Account Holder Full Name"
            placeholder="e.g. Sarah Jenkins"
            required
            value={bankData.accountName}
            onChange={(e) => setBankData({ ...bankData, accountName: e.target.value })}
          />

          <Input
            label="Bank or Financial Institution"
            placeholder="e.g. Chase Bank, Silicon Valley Bank"
            required
            value={bankData.bankName}
            onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Routing Number"
              placeholder="9-digit routing"
              value={bankData.routingNumber}
              onChange={(e) => setBankData({ ...bankData, routingNumber: e.target.value })}
            />

            <Input
              label="Account Number"
              placeholder="Account or IBAN"
              required
              value={bankData.accountNumber}
              onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPayoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700">
              Save Account Details
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

