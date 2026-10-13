import React, { useState, useMemo } from 'react';
import { DOCUMENTATION_REGISTRY, DocItem, downloadMarkdownFile, downloadDocumentationBundle } from './docsData';
import { MarkdownViewer } from './MarkdownViewer';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../app/providers/ToastContext';
import { Download, Copy, Search, ArrowLeft, ArrowRight, FolderGit2, BookOpen } from 'lucide-react';
import { cn } from '../../utils/cn';

export const DocumentationHub: React.FC = () => {
  const { toast } = useToast();
  const [selectedDocId, setSelectedDocId] = useState<string>('readme');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(DOCUMENTATION_REGISTRY.map((d) => d.category)));
    return ['all', ...cats];
  }, []);

  const filteredDocs = useMemo(() => {
    return DOCUMENTATION_REGISTRY.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const activeDoc: DocItem = useMemo(() => {
    return DOCUMENTATION_REGISTRY.find((d) => d.id === selectedDocId) || DOCUMENTATION_REGISTRY[0];
  }, [selectedDocId]);

  const currentIndex = DOCUMENTATION_REGISTRY.findIndex((d) => d.id === activeDoc.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < DOCUMENTATION_REGISTRY.length - 1;

  const handleCopyMarkdown = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(activeDoc.content);
        toast.success(`Copied markdown for: ${activeDoc.title}`);
      } else {
        toast.info(`Ready to export ${activeDoc.filename}`);
      }
    } catch {
      toast.error('Could not copy markdown to clipboard.');
    }
  };

  const handleDownloadDoc = () => {
    downloadMarkdownFile(activeDoc);
    toast.success(`Downloaded ${activeDoc.filename.split('/').pop()}`);
  };

  const handleDownloadBundle = () => {
    downloadDocumentationBundle();
    toast.success('Downloaded complete documentation bundle (14 documents).');
  };

  return (
    <div className="flex flex-col gap-8 w-full" aria-label="Documentation Hub">
      {/* Top Action & Export Header */}
      <div className="p-6 bg-navy text-white rounded-frame shadow-elevated flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 max-w-xl">
          <div className="flex items-center gap-2">
            <Badge variant="sage" size="sm">
              Single Source of Truth
            </Badge>
            <span className="text-caption font-bold text-cream/80">
              {DOCUMENTATION_REGISTRY.length} Authoritative Documents
            </span>
          </div>
          <h2 className="text-h2 font-display font-bold text-white">
            Central Documentation Hub
          </h2>
          <p className="text-small text-white/80 font-medium">
            Live in-app reader synchronized with markdown files in the repository. Inspect, copy, and export authoritative specifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadBundle}
            leftIcon={<FolderGit2 className="w-4 h-4 stroke-[2.5]" />}
          >
            Export Complete Bundle (.md)
          </Button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-4 bg-white p-5 rounded-frame border-2 border-sage-300 shadow-subtle">
          <div className="flex flex-col gap-3">
            <span className="text-small font-bold text-navy flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sage stroke-[2.5]" />
              Browse Documentation
            </span>

            {/* Search Input */}
            <Input
              placeholder="Search specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-navy stroke-[2.5]" />}
              className="text-small"
            />

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-caption font-bold transition-colors border',
                    selectedCategory === cat
                      ? 'bg-navy text-white border-navy'
                      : 'bg-cream text-navy-800 border-sage-300 hover:bg-sage-100'
                  )}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Document List */}
          <div className="flex flex-col gap-1.5 max-h-[550px] overflow-y-auto pr-1">
            {filteredDocs.map((doc) => {
              const isSelected = doc.id === activeDoc.id;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDocId(doc.id)}
                  className={cn(
                    'p-3 rounded-frame text-left transition-all flex flex-col gap-1 border-2',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy',
                    isSelected
                      ? 'bg-cream border-navy text-navy shadow-sm'
                      : 'bg-white border-transparent hover:bg-sage-50 hover:border-sage-200 text-navy-900'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-small font-bold leading-tight line-clamp-1">
                      {doc.title}
                    </span>
                    <Badge variant={isSelected ? 'navy' : 'outline'} size="sm">
                      {doc.filename.split('/').pop()}
                    </Badge>
                  </div>
                  <p className="text-[12px] font-medium text-navy-800 line-clamp-2">
                    {doc.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Content Reader Area */}
        <main className="lg:col-span-8 flex flex-col gap-6 bg-white p-6 sm:p-8 rounded-frame border-2 border-sage-300 shadow-elevated">
          {/* Header of Active Document */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-sage-300">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Badge variant="sage" size="sm">
                  {activeDoc.category}
                </Badge>
                <span className="text-caption font-mono font-bold text-navy-700">
                  {activeDoc.filename}
                </span>
              </div>
              <h1 className="text-h2 font-display font-bold text-navy">
                {activeDoc.title}
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyMarkdown}
                leftIcon={<Copy className="w-3.5 h-3.5" />}
                aria-label="Copy markdown"
              >
                Copy Markdown
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadDoc}
                leftIcon={<Download className="w-3.5 h-3.5" />}
                aria-label="Download markdown document"
              >
                Download (.md)
              </Button>
            </div>
          </div>

          {/* Rendered Document Body */}
          <div className="prose max-w-none text-navy-950 font-medium overflow-hidden">
            <MarkdownViewer content={activeDoc.content} />
          </div>

          {/* Document Bottom Navigation */}
          <div className="flex items-center justify-between pt-6 border-t-2 border-sage-300 flex-wrap gap-3">
            {hasPrev ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDocId(DOCUMENTATION_REGISTRY[currentIndex - 1].id)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Previous: {DOCUMENTATION_REGISTRY[currentIndex - 1].title}
              </Button>
            ) : <div />}

            {hasNext && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDocId(DOCUMENTATION_REGISTRY[currentIndex + 1].id)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next: {DOCUMENTATION_REGISTRY[currentIndex + 1].title}
              </Button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
