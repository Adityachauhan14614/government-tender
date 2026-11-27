import React, { useState } from 'react';
import { Tender, MatchResult, TrackedTender, ApplicationStatus } from '../types';
import { formatINR } from '../services/matchmaker';
import { normalizeStatus } from '../services/tenderStorage';
import { 
  Bookmark, 
  Calendar, 
  Building, 
  ExternalLink, 
  FileCheck2, 
  CheckCircle2, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Inbox,
  Clock,
  Edit3,
  Save,
  Plus,
  AlertCircle,
  FileText,
  DollarSign,
  ChevronDown
} from 'lucide-react';

interface BidTrackerProps {
  trackedTenders: Record<string, TrackedTender>;
  tenders: Tender[];
  matches: Map<string, MatchResult>;
  onUpdateStatus: (tenderId: string, status: ApplicationStatus) => void;
  onRemoveTracked: (tenderId: string) => void;
  onOpenDetails: (tender: Tender) => void;
  onSaveNotes: (tenderId: string, notes: string) => void;
  onUpdateTargetDate?: (tenderId: string, targetDate: string) => void;
  onTrackTender?: (tenderId: string) => void;
}

// 6 required columns aligned with instructions
const PIPELINE_COLUMNS: { 
  id: ApplicationStatus; 
  title: string; 
  color: string;
  badgeBg: string;
  badgeText: string;
}[] = [
  { 
    id: 'Interested', 
    title: 'Interested / Watching', 
    color: 'border-slate-300 bg-slate-50/80 text-slate-800',
    badgeBg: 'bg-slate-200',
    badgeText: 'text-slate-800'
  },
  { 
    id: 'Preparing Documents', 
    title: 'Preparing Documents', 
    color: 'border-blue-300 bg-blue-50/70 text-blue-950',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-900'
  },
  { 
    id: 'Ready to Submit', 
    title: 'Ready to Submit', 
    color: 'border-amber-300 bg-amber-50/70 text-amber-950',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900'
  },
  { 
    id: 'Submitted', 
    title: 'Bid Submitted', 
    color: 'border-purple-300 bg-purple-50/70 text-purple-950',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-900'
  },
  { 
    id: 'Won', 
    title: 'Won (Awarded)', 
    color: 'border-emerald-300 bg-emerald-50/70 text-emerald-950',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900'
  },
  { 
    id: 'Lost', 
    title: 'Lost / Closed', 
    color: 'border-rose-300 bg-rose-50/70 text-rose-950',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-900'
  },
];

export { normalizeStatus };

export const BidTracker: React.FC<BidTrackerProps> = ({
  trackedTenders,
  tenders,
  matches,
  onUpdateStatus,
  onRemoveTracked,
  onOpenDetails,
  onSaveNotes,
  onUpdateTargetDate,
  onTrackTender,
}) => {
  const trackedList = Object.values(trackedTenders);

  // Local state for editing notes & dates inline
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');
  const [selectedQuickAddId, setSelectedQuickAddId] = useState<string>('');

  // Untracked tenders for quick-add dropdown
  const untrackedTenders = tenders.filter(t => !trackedTenders[t.id]);

  // Aggregate stats
  const totalPipelineValue = trackedList.reduce((sum, item) => {
    const tender = tenders.find(t => t.id === item.tenderId);
    return sum + (tender ? tender.estimatedValue : 0);
  }, 0);

  const submittedValue = trackedList
    .filter(item => normalizeStatus(item.status) === 'Submitted')
    .reduce((sum, item) => {
      const tender = tenders.find(t => t.id === item.tenderId);
      return sum + (tender ? tender.estimatedValue : 0);
    }, 0);

  const wonValue = trackedList
    .filter(item => normalizeStatus(item.status) === 'Won')
    .reduce((sum, item) => {
      const tender = tenders.find(t => t.id === item.tenderId);
      return sum + (tender ? tender.estimatedValue : 0);
    }, 0);

  // Notes editing helpers
  const startEditingNotes = (tenderId: string, currentNotes: string) => {
    setEditingNotesId(tenderId);
    setTempNotes(currentNotes || '');
  };

  const saveNotes = (tenderId: string) => {
    onSaveNotes(tenderId, tempNotes);
    setEditingNotesId(null);
  };

  const handleQuickAdd = () => {
    if (!selectedQuickAddId || !onTrackTender) return;
    onTrackTender(selectedQuickAddId);
    setSelectedQuickAddId('');
  };

  return (
    <div className="space-y-6">
      
      {/* Pipeline Summary Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Tender Bid Pipeline & Document Tracker</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your bidding journey from initial interest to document preparation, final submission, and bid outcome.
          </p>
        </div>

        {/* Quick Add Dropdown & Stats */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {untrackedTenders.length > 0 && onTrackTender && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1 rounded-xl">
              <select
                value={selectedQuickAddId}
                onChange={(e) => setSelectedQuickAddId(e.target.value)}
                className="bg-transparent text-xs py-1 px-2 text-slate-700 outline-hidden max-w-[200px]"
              >
                <option value="">+ Add Tender to Pipeline...</option>
                {untrackedTenders.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.tenderNumber} - {t.title.slice(0, 30)}...
                  </option>
                ))}
              </select>
              <button
                onClick={handleQuickAdd}
                disabled={!selectedQuickAddId}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                  selectedQuickAddId 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Add
              </button>
            </div>
          )}

          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">In Pipeline</span>
            <span className="text-base font-extrabold text-slate-900">{trackedList.length}</span>
          </div>

          <div className="bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-200 text-center">
            <span className="text-[10px] text-blue-600 uppercase font-bold block">Active Pipeline Value</span>
            <span className="text-base font-extrabold text-blue-900">{formatINR(totalPipelineValue)}</span>
          </div>

          {wonValue > 0 && (
            <div className="bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] text-emerald-600 uppercase font-bold block">Awarded Won Value</span>
              <span className="text-base font-extrabold text-emerald-900">{formatINR(wonValue)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {trackedList.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-200 space-y-3">
          <Inbox className="w-14 h-14 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Your Bid Pipeline is Empty</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You haven't tracked any tenders yet. You can add tenders to your pipeline by clicking the bookmark button on any tender card in the Matched Tenders tab, or using the quick-add dropdown above.
          </p>
        </div>
      ) : (
        /* 6 Kanban Columns */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {PIPELINE_COLUMNS.map((col) => {
            const colItems = trackedList.filter(item => normalizeStatus(item.status) === col.id);
            const colValue = colItems.reduce((acc, item) => {
              const t = tenders.find(x => x.id === item.tenderId);
              return acc + (t ? t.estimatedValue : 0);
            }, 0);

            return (
              <div 
                key={col.id} 
                className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 flex flex-col min-h-[520px]"
              >
                {/* Column Header */}
                <div className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between ${col.color}`}>
                  <div className="min-w-0 pr-1">
                    <h3 className="font-bold text-xs truncate">{col.title}</h3>
                    <span className="text-[10px] opacity-75 font-mono">{formatINR(colValue)}</span>
                  </div>
                  <span className={`w-5 h-5 rounded-full ${col.badgeBg} ${col.badgeText} font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}>
                    {colItems.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colItems.length === 0 ? (
                    <div className="h-28 flex flex-col items-center justify-center text-center p-3 text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      <span>No tenders in this stage</span>
                    </div>
                  ) : (
                    colItems.map((item) => {
                      const tender = tenders.find(t => t.id === item.tenderId);
                    const match = tender ? matches.get(tender.id) : null;
                    if (!tender || !match) return null;

                    const totalDocs = tender.documentsRequired?.length || 0;
                    const completedDocs = (tender.documentsRequired || []).filter(d => item.checklist?.[d]).length;
                    const progressPercent = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;
                    const isEditingNotes = editingNotesId === item.tenderId;

                    return (
                      <div 
                        key={item.tenderId}
                        className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all space-y-2.5"
                      >
                        {/* Header: Portal & Match */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                            {tender.portal} • {tender.tenderNumber.split('/').pop() || tender.tenderNumber}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            match.overallScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {match.overallScore}% Fit
                          </span>
                        </div>

                        {/* Title (Clickable) */}
                        <h4 
                          onClick={() => onOpenDetails(tender)}
                          className="font-bold text-xs text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-2 leading-snug"
                          title="Click to view full tender RFP and criteria"
                        >
                          {tender.title}
                        </h4>

                        {/* Department */}
                        <div className="text-[11px] text-slate-500 truncate">
                          {tender.issuingAuthority}
                        </div>

                        {/* Value & Official Deadline */}
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                          <span className="font-bold text-slate-900">{formatINR(tender.estimatedValue)}</span>
                          <span className="text-[10px] text-slate-500">
                            Due: {new Date(tender.submissionDeadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        {/* Target Bid Submission Date Picker */}
                        <div className="bg-slate-50 p-2 rounded-lg text-[10px] space-y-1">
                          <div className="flex items-center justify-between font-semibold text-slate-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>Target Bid Date:</span>
                            </span>
                            <input
                              type="date"
                              value={item.targetSubmissionDate || tender.submissionDeadline.slice(0, 10)}
                              onChange={(e) => {
                                if (onUpdateTargetDate) {
                                  onUpdateTargetDate(item.tenderId, e.target.value);
                                }
                              }}
                              className="bg-white border border-slate-200 rounded px-1 text-[10px] text-slate-700 outline-hidden font-mono cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Document checklist progress */}
                        {totalDocs > 0 && (
                          <div className="bg-slate-50 p-2 rounded-lg text-[10px] space-y-1">
                            <div className="flex items-center justify-between font-semibold text-slate-600">
                              <span>Documents Ready</span>
                              <span>{completedDocs}/{totalDocs} ({progressPercent}%)</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-blue-600 h-full rounded-full transition-all"
                                style={{ width: `${progressPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Internal Bid Notes */}
                        <div className="bg-slate-50 p-2 rounded-lg text-[10px] space-y-1">
                          <div className="flex items-center justify-between font-semibold text-slate-600">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3 text-slate-400" />
                              <span>Bid Notes:</span>
                            </span>
                            {!isEditingNotes && (
                              <button
                                onClick={() => startEditingNotes(item.tenderId, item.userNotes)}
                                className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-0.5 cursor-pointer"
                              >
                                <Edit3 className="w-2.5 h-2.5" />
                                <span>{item.userNotes ? 'Edit' : 'Add Note'}</span>
                              </button>
                            )}
                          </div>

                          {isEditingNotes ? (
                            <div className="space-y-1 pt-1">
                              <textarea
                                value={tempNotes}
                                onChange={(e) => setTempNotes(e.target.value)}
                                rows={2}
                                placeholder="E.g. Quotation received from supplier, waiting on CA cert..."
                                className="w-full bg-white border border-slate-300 rounded p-1 text-[10px] text-slate-800 outline-hidden focus:border-blue-500"
                              />
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setEditingNotesId(null)}
                                  className="px-1.5 py-0.5 rounded text-slate-500 hover:bg-slate-200 cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => saveNotes(item.tenderId)}
                                  className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer flex items-center gap-1"
                                >
                                  <Save className="w-2.5 h-2.5" />
                                  <span>Save</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-slate-600 text-[10px] line-clamp-2 italic">
                              {item.userNotes ? `"${item.userNotes}"` : 'No notes recorded.'}
                            </p>
                          )}
                        </div>

                        {/* Quick Action & Status Mover */}
                        <div className="flex items-center justify-between pt-1 gap-1">
                          <select
                            value={normalizeStatus(item.status)}
                            onChange={(e) => onUpdateStatus(item.tenderId, e.target.value as ApplicationStatus)}
                            className="text-[10px] bg-slate-50 border border-slate-300 rounded px-1.5 py-1 font-semibold text-slate-700 outline-hidden flex-1 cursor-pointer"
                          >
                            <option value="Interested">Move: Interested</option>
                            <option value="Preparing Documents">Move: Preparing</option>
                            <option value="Ready to Submit">Move: Ready</option>
                            <option value="Submitted">Move: Submitted</option>
                            <option value="Won">Move: Won</option>
                            <option value="Lost">Move: Lost</option>
                          </select>

                          {/* View details */}
                          <button
                            onClick={() => onOpenDetails(tender)}
                            className="text-slate-500 hover:text-blue-600 p-1 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            title="View Full RFP Details"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          {/* Remove with confirmation */}
                          <button
                            onClick={() => onRemoveTracked(item.tenderId)}
                            className="text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Remove from pipeline"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  }))}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
