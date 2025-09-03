import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Heart, 
  Eye, 
  Clock, 
  Pin, 
  Lock, 
  Plus,
  Search,
  Filter,
  TrendingUp,
  Users
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@clerk/clerk-react';
import { formatDistanceToNow } from 'date-fns';
import type { ForumTopic, ForumCategory, InsertForumTopic } from '@shared/schema';
import { BannerAd, DisplayAd, InArticleAd } from '@/components/ads/adsense-block';
// import { AdSlot, ShopifyAffiliateBanner } from '@/components/ads/ad-slot'; // Temporarily disabled

interface ForumTopicWithUser extends ForumTopic {
  author: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  category: {
    name: string;
    color: string;
  };
}

const mockCategories: ForumCategory[] = [
  {
    id: '1',
    name: 'General Skincare',
    description: 'General skincare discussions and questions',
    slug: 'general-skincare',
    color: '#6366f1',
    icon: '💄',
    sortOrder: 1,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Product Reviews',
    description: 'Share your honest product reviews',
    slug: 'product-reviews',
    color: '#f59e0b',
    icon: '⭐',
    sortOrder: 2,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Routine Help',
    description: 'Get help building your skincare routine',
    slug: 'routine-help',
    color: '#10b981',
    icon: '📋',
    sortOrder: 3,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'Ingredient Science',
    description: 'Deep dive into skincare ingredients',
    slug: 'ingredient-science',
    color: '#8b5cf6',
    icon: '🧪',
    sortOrder: 4,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '5',
    name: 'South African Brands',
    description: 'Discuss local SA skincare brands',
    slug: 'south-african-brands',
    color: '#ef4444',
    icon: '🇿🇦',
    sortOrder: 5,
    isActive: true,
    createdAt: new Date(),
  },
];

const mockTopics: ForumTopicWithUser[] = [
  {
    id: '1',
    categoryId: '1',
    userId: 'user1',
    title: 'Help! My skin is breaking out after starting retinol',
    content: 'I started using retinol 2 weeks ago and my skin is getting worse. Is this normal purging or should I stop?',
    isSticky: false,
    isLocked: false,
    views: 145,
    replies: 12,
    lastReplyAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    lastReplyUserId: 'user2',
    tags: ['retinol', 'purging', 'acne'],
    imageUrls: [],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    author: {
      firstName: 'Sarah',
      lastName: 'M',
      profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    },
    category: {
      name: 'General Skincare',
      color: '#6366f1',
    },
  },
  {
    id: '2',
    categoryId: '2',
    userId: 'user3',
    title: 'CeraVe vs Cetaphil: Which cleanser is better for dry skin?',
    content: 'Been debating between these two popular cleansers. Looking for experiences from people with dry, sensitive skin.',
    isSticky: true,
    isLocked: false,
    views: 89,
    replies: 8,
    lastReplyAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    lastReplyUserId: 'user4',
    tags: ['cerave', 'cetaphil', 'cleanser', 'dry-skin'],
    imageUrls: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    author: {
      firstName: 'Mike',
      lastName: 'K',
      profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    category: {
      name: 'Product Reviews',
      color: '#f59e0b',
    },
  },
  {
    id: '3',
    categoryId: '5',
    userId: 'user5',
    title: 'Spotlight: African Potato for skincare - local ingredients that work',
    content: 'Has anyone tried products with African Potato extract? I found some amazing SA brands using this ingredient.',
    isSticky: false,
    isLocked: false,
    views: 67,
    replies: 15,
    lastReplyAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    lastReplyUserId: 'user6',
    tags: ['south-african', 'natural', 'african-potato', 'local-brands'],
    imageUrls: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    author: {
      firstName: 'Thandiwe',
      lastName: 'N',
    },
    category: {
      name: 'South African Brands',
      color: '#ef4444',
    },
  },
];

export default function CommunityForumPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [newTopicForm, setNewTopicForm] = useState({
    title: '',
    content: '',
    categoryId: '',
    tags: '',
  });

  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // This would normally fetch from API
  const { data: categories = mockCategories } = useQuery({
    queryKey: ['/api/forum/categories'],
    enabled: false, // Using mock data for now
  });

  const { data: topics = mockTopics } = useQuery({
    queryKey: ['/api/forum/topics', selectedCategory, searchQuery],
    enabled: false, // Using mock data for now
  });

  const createTopicMutation = useMutation({
    mutationFn: async (topicData: InsertForumTopic) => {
      return apiRequest('/api/forum/topics', {
        method: 'POST',
        body: JSON.stringify(topicData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/topics'] });
      setIsNewTopicOpen(false);
      setNewTopicForm({ title: '', content: '', categoryId: '', tags: '' });
    },
  });

  const handleCreateTopic = () => {
    if (!isAuthenticated || !user) return;

    createTopicMutation.mutate({
      title: newTopicForm.title,
      content: newTopicForm.content,
      categoryId: newTopicForm.categoryId,
      userId: user.id,
      tags: newTopicForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isSticky: false,
      isLocked: false,
      views: 0,
      replies: 0,
      imageUrls: [],
    });
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || topic.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Top Banner Ad */}
        <BannerAd className="mb-6" />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Forum</h1>
              <p className="text-gray-600">Connect, share, and learn with the SKYNN community</p>
            </div>
            
            {isAuthenticated && (
              <Dialog open={isNewTopicOpen} onOpenChange={setIsNewTopicOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700" data-testid="button-new-topic">
                    <Plus className="h-4 w-4 mr-2" />
                    New Topic
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Topic</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Topic title..."
                      value={newTopicForm.title}
                      onChange={(e) => setNewTopicForm(prev => ({ ...prev, title: e.target.value }))}
                      data-testid="input-topic-title"
                    />
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newTopicForm.categoryId}
                      onChange={(e) => setNewTopicForm(prev => ({ ...prev, categoryId: e.target.value }))}
                      data-testid="select-topic-category"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                    <Textarea
                      placeholder="Share your thoughts, questions, or experiences..."
                      value={newTopicForm.content}
                      onChange={(e) => setNewTopicForm(prev => ({ ...prev, content: e.target.value }))}
                      rows={6}
                      data-testid="textarea-topic-content"
                    />
                    <Input
                      placeholder="Tags (comma-separated)"
                      value={newTopicForm.tags}
                      onChange={(e) => setNewTopicForm(prev => ({ ...prev, tags: e.target.value }))}
                      data-testid="input-topic-tags"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsNewTopicOpen(false)}
                        data-testid="button-cancel-topic"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreateTopic}
                        disabled={createTopicMutation.isPending || !newTopicForm.title || !newTopicForm.content}
                        data-testid="button-create-topic"
                      >
                        {createTopicMutation.isPending ? 'Creating...' : 'Create Topic'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-topics"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white"
              data-testid="select-category-filter"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  className={`w-full text-left p-2 rounded-md transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-pink-100 text-pink-800' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCategory('all')}
                  data-testid="category-all"
                >
                  All Topics
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`w-full text-left p-2 rounded-md transition-colors ${
                      selectedCategory === category.id 
                        ? 'bg-pink-100 text-pink-800' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                    data-testid={`category-${category.slug}`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Topics</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Members</span>
                  <span className="font-semibold">523</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Posts Today</span>
                  <span className="font-semibold">89</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Topics List */}
          <div className="lg:col-span-3">
            {/* Display Ad before topics */}
            {/* AdSlot placeholder */}
            
            <div className="space-y-4">
              {filteredTopics.map((topic) => (
                <Card key={topic.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={topic.author.profileImageUrl} />
                        <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                          {topic.author.firstName[0]}{topic.author.lastName[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {topic.isSticky && <Pin className="h-4 w-4 text-green-600" />}
                          {topic.isLocked && <Lock className="h-4 w-4 text-red-600" />}
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={{ backgroundColor: topic.category.color + '20', color: topic.category.color }}
                          >
                            {topic.category.name}
                          </Badge>
                        </div>

                        <h3 className="font-semibold text-lg mb-2 hover:text-pink-600 cursor-pointer" data-testid={`topic-title-${topic.id}`}>
                          {topic.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {topic.content}
                        </p>

                        {topic.tags && topic.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {topic.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {topic.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {topic.replies}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{topic.author.firstName} {topic.author.lastName}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDistanceToNow(topic.createdAt, { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredTopics.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No topics found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery ? 'Try adjusting your search terms' : 'Be the first to start a discussion!'}
                    </p>
                    {isAuthenticated && (
                      <Button 
                        onClick={() => setIsNewTopicOpen(true)}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        data-testid="button-create-first-topic"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Topic
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Bottom In-Article Ad */}
              <InArticleAd className="mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}