import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload, 
  FileText, 
  Image, 
  Video, 
  ArrowLeft, 
  CheckCircle2, 
  X,
  Sparkles,
  Hash,
  Target,
  Edit2,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Zap,
  Check,
  ImageIcon
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { toast } from "sonner";
import { EditableCaption } from "../components/EditableCaption";
import { EditableHashtags } from "../components/EditableHashtags";
import { EditablePlatforms } from "../components/EditablePlatforms";
import { generateCaptionWithGemini } from "../utils/geminiHelper";

interface UploadedFile {
  file: File;
  preview?: string;
}

interface AIAnalysis {
  caption: string;
  hashtags: string[];
  platforms: string[];
}

interface Platform {
  id: string;
  name: string;
  icon: any;
  enabled: boolean;
  recommendedTime: string;
  color: string;
}

// Allowed file types for social media
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif'
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime', // .mov
  'video/x-msvideo', // .avi
  'video/webm',
  'video/x-matroska', // .mkv
  'video/x-flv',
  'video/x-ms-wmv'
];

const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

const ALLOWED_EXTENSIONS = '.jpg,.jpeg,.png,.gif,.webp,.heic,.heif,.mp4,.mov,.avi,.webm,.mkv,.flv,.wmv';

export default function UploadPage() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);

  // Auth guard: redirect to /auth if not logged in
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!userInfo && isAuthenticated !== "true") {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);


  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({
    caption: "",
    hashtags: [],
    platforms: ["Instagram", "LinkedIn", "Facebook"]
  });
  
  // AI Caption Generation States
  const [showAiCaptionChoice, setShowAiCaptionChoice] = useState(false);
  const [useAiCaptions, setUseAiCaptions] = useState<boolean | null>(null);
  const [generatingCaption, setGeneratingCaption] = useState(false);
  
  const [platforms, setPlatforms] = useState<Platform[]>([
    { id: "instagram", name: "Instagram", icon: Instagram, enabled: true, recommendedTime: "6:00 PM - Peak Engagement", color: "from-pink-500 to-purple-500" },
    { id: "facebook", name: "Facebook", icon: Facebook, enabled: true, recommendedTime: "1:00 PM - High Activity", color: "from-blue-600 to-blue-400" },
    { id: "youtube", name: "YouTube", icon: Youtube, enabled: false, recommendedTime: "3:00 PM - Best Viewership", color: "from-red-600 to-red-400" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, enabled: true, recommendedTime: "8:00 AM - Professional Hours", color: "from-blue-700 to-cyan-500" },
    { id: "twitter", name: "Twitter", icon: Twitter, enabled: false, recommendedTime: "12:00 PM - Lunch Break", color: "from-cyan-500 to-blue-400" },
  ]);

  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  
  // Editing states
  const [editingCaption, setEditingCaption] = useState(false);
  const [editingHashtags, setEditingHashtags] = useState(false);
  const [editingPlatforms, setEditingPlatforms] = useState(false);
  
  // Temporary edit values
  const [tempCaption, setTempCaption] = useState("");
  const [tempHashtags, setTempHashtags] = useState("");
  const [newHashtag, setNewHashtag] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
    e.target.value = '';
  };

  const handleFile = (file: File) => {
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type.toLowerCase())) {
      toast.error('Invalid file type', {
        description: 'Please upload only images (JPG, PNG, GIF, WebP, HEIC) or videos (MP4, MOV, AVI, WebM, MKV, FLV, WMV)',
        duration: 5000,
      });
      return;
    }

    // Additional validation for file extension (backup check)
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowedExtArray = ALLOWED_EXTENSIONS.split(',');
    
    if (!allowedExtArray.includes(fileExtension)) {
      toast.error('Invalid file format', {
        description: 'This file format is not supported. Please upload images or videos only.',
        duration: 5000,
      });
      return;
    }

    const preview = URL.createObjectURL(file);
    setUploadedFile({ file, preview });
    startAnalysis();
  };

  const startAnalysis = () => {
    setAnalyzing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          setAnalysisComplete(true);
          setShowAiCaptionChoice(true); // Show AI caption choice after analysis
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Handle preview image upload
  const previewFileInputRef = useRef<HTMLInputElement>(null);

  const handlePreviewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image too large", {
          description: "Please select an image under 5MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setPreviewImage(imageData);
        // Save to localStorage so it can be accessed in AdPreviewPage
        localStorage.setItem("adPreviewImage", imageData);
        toast.success("Preview image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreviewImageClick = () => {
    previewFileInputRef.current?.click();
  };

  const togglePlatform = (id: string) => {
    setPlatforms(platforms.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  // Caption editing handlers
  const startEditingCaption = () => {
    setTempCaption(aiAnalysis.caption);
    setEditingCaption(true);
  };

  const saveCaption = () => {
    setAiAnalysis({ ...aiAnalysis, caption: tempCaption });
    setEditingCaption(false);
    toast.success('Caption updated successfully!');
  };

  const cancelEditCaption = () => {
    setEditingCaption(false);
    setTempCaption("");
  };

  // Hashtag editing handlers
  const startEditingHashtags = () => {
    setEditingHashtags(true);
  };

  const addHashtag = () => {
    if (newHashtag.trim()) {
      const formattedHashtag = newHashtag.startsWith('#') ? newHashtag : `#${newHashtag}`;
      setAiAnalysis({
        ...aiAnalysis,
        hashtags: [...aiAnalysis.hashtags, formattedHashtag]
      });
      setNewHashtag("");
      toast.success('Hashtag added!');
    }
  };

  const removeHashtag = (index: number) => {
    setAiAnalysis({
      ...aiAnalysis,
      hashtags: aiAnalysis.hashtags.filter((_, i) => i !== index)
    });
    toast.success('Hashtag removed!');
  };

  const saveHashtags = () => {
    setEditingHashtags(false);
    toast.success('Hashtags updated successfully!');
  };

  // Platform editing handlers
  const togglePlatformInAnalysis = (platformName: string) => {
    if (aiAnalysis.platforms.includes(platformName)) {
      setAiAnalysis({
        ...aiAnalysis,
        platforms: aiAnalysis.platforms.filter(p => p !== platformName)
      });
    } else {
      setAiAnalysis({
        ...aiAnalysis,
        platforms: [...aiAnalysis.platforms, platformName]
      });
    }
  };

  const startEditingPlatforms = () => {
    setEditingPlatforms(true);
  };

  const savePlatforms = () => {
    setEditingPlatforms(false);
    toast.success('Platform recommendations updated!');
  };

  // AI Caption Generation Handlers
  const handleAiCaptionChoice = (choice: boolean) => {
    setUseAiCaptions(choice);
    setShowAiCaptionChoice(false);
    
    if (choice) {
      generateAiCaptions();
    } else {
      // Show empty fields for manual entry
      setAiAnalysis({
        caption: "",
        hashtags: [],
        platforms: ["Instagram", "Facebook", "LinkedIn"]
      });
      toast.info("You can now manually enter your caption and hashtags");
    }
  };

  const generateAiCaptions = async () => {
    setGeneratingCaption(true);
    
    // Call Gemini AI API to generate captions and hashtags
    await generateWithGemini();
  };

  const generateWithGemini = async () => {
    try {
      // Get the uploaded file
      if (!uploadedFile) {
        toast.error("No file uploaded");
        setGeneratingCaption(false);
        return;
      }

      // Simulate AI generation with realistic mock data
      // In production, replace this with actual Gemini API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call delay

      // Determine if it's an image or video
      const isImage = uploadedFile.file.type.startsWith('image/');
      const isVideo = uploadedFile.file.type.startsWith('video/');

      // Generate contextual mock data based on file type
      let mockCaption = "";
      let mockHashtags: string[] = [];

      if (isImage) {
        mockCaption = "Transform your digital presence with AI-powered marketing automation! 🚀 Discover how cutting-edge technology can revolutionize your content strategy and boost engagement across all platforms. ✨";
        mockHashtags = ["#DigitalMarketing", "#AIAutomation", "#VulpinixAI", "#MarketingTech", "#SocialMediaMarketing", "#ContentCreation", "#FutureOfWork"];
      } else if (isVideo) {
        mockCaption = "Watch how AI is reshaping the future of digital marketing! 🎥 From automated campaigns to intelligent analytics, discover the tools that will take your brand to the next level. 💡";
        mockHashtags = ["#VideoMarketing", "#AITechnology", "#VulpinixAI", "#DigitalTransformation", "#MarketingAutomation", "#TechInnovation", "#ContentStrategy"];
      } else {
        mockCaption = "Elevate your marketing game with AI-powered solutions! 🌟 Join the revolution in digital marketing automation and watch your engagement soar. Ready to transform your strategy? 🚀";
        mockHashtags = ["#DigitalMarketing", "#AIAutomation", "#VulpinixAI", "#MarketingTech", "#Innovation", "#FutureReady", "#GrowthHacking"];
      }

      // Update the AI analysis with generated content
      setAiAnalysis({
        caption: mockCaption,
        hashtags: mockHashtags,
        platforms: ["Instagram", "Facebook", "LinkedIn"]
      });
      
      setGeneratingCaption(false);
      toast.success("AI captions and hashtags generated successfully!");
      
    } catch (error: any) {
      console.error("Error generating captions:", error);
      
      // Fallback to default content if anything fails
      setAiAnalysis({
        caption: "Discover the future of digital marketing with AI-powered automation. Transform your content strategy today! 🚀",
        hashtags: ["#DigitalMarketing", "#AIAutomation", "#VulpinixAI", "#MarketingTech", "#FutureOfWork"],
        platforms: ["Instagram", "Facebook", "LinkedIn"]
      });
      
      setGeneratingCaption(false);
      toast.success("Default captions generated!");
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-8 h-8" />;
    if (file.type.startsWith('video/')) return <Video className="w-8 h-8" />;
    return <FileText className="w-8 h-8" />;
  };

  const enabledPlatforms = platforms.filter(p => p.enabled);
  const estimatedReach = enabledPlatforms.length * 2500;
  const aiScore = 94;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0f1235] to-black"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* AI Circuit Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-upload" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#00ffff" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#00ffff" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="0" stroke="#00ffff" strokeWidth="0.5" />
              <circle cx="0" cy="50" r="2" fill="#a855f7" />
              <circle cx="50" cy="0" r="2" fill="#3b82f6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-upload)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* SECTION 1 - Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <span className="hover:text-cyan-400 cursor-pointer">Dashboard</span>
              <span>/</span>
              <span className="text-cyan-400">Upload Content</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl text-white mb-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent text-center">
              Upload & Publish Content
            </h1>
            <p className="text-xl text-gray-400 text-center">
              Let AI optimize and distribute your content across platforms
            </p>
          </div>

          {/* Main Content - Centered */}
          <div className="max-w-4xl mx-auto space-y-8">
              {/* SECTION 2 - Upload Content Box */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-2xl"></div>
                
                <div className="relative">
                  {!uploadedFile ? (
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={handleBrowseClick}
                      className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer ${
                        dragActive
                          ? "border-cyan-400 bg-cyan-500/20"
                          : "border-purple-500/50 bg-purple-500/5"
                      } hover:border-cyan-400/70 hover:bg-purple-500/10`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleChange}
                        className="hidden"
                        accept={ALLOWED_EXTENSIONS}
                      />
                      
                      <div className="flex flex-col items-center justify-center pointer-events-none">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/50 animate-pulse">
                          <Upload className="w-10 h-10 text-white" />
                        </div>
                        
                        <h3 className="text-2xl text-white mb-2">
                          Drag & Drop your content here
                        </h3>
                        
                        <p className="text-gray-400 mb-2">
                          Images: JPG, PNG, GIF, WebP, HEIC
                        </p>
                        <p className="text-gray-400 mb-6">
                          Videos: MP4, MOV, AVI, WebM, MKV, FLV, WMV
                        </p>
                        
                        <div className="pointer-events-auto">
                          <Button
                            type="button"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              handleBrowseClick();
                            }}
                            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-6 rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-cyan-500/50 transition-all duration-300"
                          >
                            <Upload className="w-5 h-5 mr-2" />
                            Upload File
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* File Preview */}
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center text-white overflow-hidden">
                          {uploadedFile.preview ? (
                            <img src={uploadedFile.preview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            getFileIcon(uploadedFile.file)
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-white font-medium">{uploadedFile.file.name}</p>
                          <p className="text-sm text-gray-400">{(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        
                        <Button
                          onClick={() => {
                            setUploadedFile(null);
                            setAnalyzing(false);
                            setAnalysisComplete(false);
                            setProgress(0);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* SECTION 3 - AI Auto-Analysis */}
                      {analyzing && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-cyan-500/30"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
                            <span className="text-white">Analyzing your content with AI...</span>
                          </div>
                          
                          <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/50"
                              initial={{ width: "0%" }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          
                          <p className="text-sm text-gray-400 mt-2 text-right">{progress}%</p>
                        </motion.div>
                      )}

                      {/* AI Caption Choice Modal */}
                      <AnimatePresence>
                        {showAiCaptionChoice && (
                          <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/20 via-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/50 backdrop-blur-sm shadow-2xl shadow-cyan-500/30"
                          >
                            <div className="text-center space-y-6">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/50 animate-pulse">
                                <Sparkles className="w-8 h-8 text-white" />
                              </div>
                              
                              <div>
                                <h3 className="text-2xl text-white mb-2 font-semibold">
                                  AI Caption Generation
                                </h3>
                                <p className="text-gray-300 max-w-md mx-auto">
                                  Would you like our AI to automatically generate engaging captions and hashtags for your content?
                                </p>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                  onClick={() => handleAiCaptionChoice(true)}
                                  size="lg"
                                  className="px-10 py-6 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 hover:from-purple-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-105"
                                >
                                  <Sparkles className="w-5 h-5 mr-2" />
                                  Yes, Generate with AI
                                </Button>
                                
                                <Button
                                  onClick={() => handleAiCaptionChoice(false)}
                                  variant="outline"
                                  size="lg"
                                  className="px-10 py-6 border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400/70 rounded-xl transition-all duration-300"
                                >
                                  <Edit2 className="w-5 h-5 mr-2" />
                                  No, I'll Write Manually
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* AI Generating Caption Animation */}
                      {generatingCaption && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-8 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-2 border-cyan-400/50 backdrop-blur-sm"
                        >
                          <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/50 animate-spin">
                              <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h4 className="text-xl text-white mb-2">Generating AI Captions...</h4>
                              <p className="text-sm text-gray-400">Our AI is analyzing your content and creating engaging captions and hashtags</p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* AI Analysis Results */}
                      <AnimatePresence>
                        {analysisComplete && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            {/* Suggested Caption */}
                            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm hover:border-purple-400/50 transition-all">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-5 h-5 text-purple-400" />
                                  <h4 className="text-white font-medium">Caption</h4>
                                </div>
                                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300" onClick={startEditingCaption}>
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </div>
                              {editingCaption ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={tempCaption}
                                    onChange={(e) => setTempCaption(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border-2 border-purple-500/30 text-white focus:border-cyan-400/50 focus:outline-none transition-all"
                                  />
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      onClick={saveCaption}
                                      className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-105"
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={cancelEditCaption}
                                      className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-300 line-clamp-3">{aiAnalysis.caption}</p>
                              )}
                            </div>

                            {/* AI Hashtags */}
                            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Hash className="w-5 h-5 text-cyan-400" />
                                  <h4 className="text-white font-medium">Hashtags</h4>
                                </div>
                                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300" onClick={startEditingHashtags}>
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </div>
                              {editingHashtags ? (
                                <div className="space-y-2">
                                  <div className="flex flex-wrap gap-1">
                                    {aiAnalysis.hashtags.map((tag, i) => (
                                      <span key={i} className="text-xs text-cyan-300 bg-cyan-500/20 px-2 py-1 rounded">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={newHashtag}
                                      onChange={(e) => setNewHashtag(e.target.value)}
                                      className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border-2 border-purple-500/30 text-white focus:border-cyan-400/50 focus:outline-none transition-all"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={addHashtag}
                                      className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-105"
                                    >
                                      Add
                                    </Button>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {aiAnalysis.hashtags.map((tag, i) => (
                                      <span key={i} className="text-xs text-cyan-300 bg-cyan-500/20 px-2 py-1 rounded flex items-center gap-1">
                                        {tag}
                                        <Button
                                          size="xs"
                                          onClick={() => removeHashtag(i)}
                                          className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-2 py-1 rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      onClick={saveHashtags}
                                      className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-105"
                                    >
                                      Save
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-1">
                                  {aiAnalysis.hashtags.map((tag, i) => (
                                    <span key={i} className="text-xs text-cyan-300 bg-cyan-500/20 px-2 py-1 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4 - Choose Platforms */}
              {analysisComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 border-2 border-cyan-500/30 backdrop-blur-sm shadow-2xl shadow-cyan-500/20"
                >
                  <h3 className="text-2xl text-white mb-6 flex items-center gap-2">
                    <Target className="w-6 h-6 text-cyan-400" />
                    Choose Platforms
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {platforms.map((platform) => {
                      const Icon = platform.icon;
                      return (
                        <div
                          key={platform.id}
                          className={`p-4 rounded-xl border-2 backdrop-blur-sm transition-all duration-300 ${
                            platform.enabled
                              ? "bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20"
                              : "bg-gray-800/20 border-gray-700/30"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center shadow-lg`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <Switch
                              checked={platform.enabled}
                              onCheckedChange={() => togglePlatform(platform.id)}
                            />
                          </div>
                          
                          <h4 className="text-white font-medium mb-1">{platform.name}</h4>
                          <p className="text-xs text-gray-400">{platform.recommendedTime}</p>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* SECTION 5 - Schedule or Publish */}
              {analysisComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20"
                >
                  <h3 className="text-2xl text-white mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-purple-400" />
                    Schedule & Publish
                  </h3>
                  
                  {/* Preview Image Upload */}
                  <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-2 border-cyan-500/30">
                    <h4 className="text-lg text-white mb-4 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-cyan-400" />
                      Ad Preview Image (Optional)
                    </h4>
                    <p className="text-sm text-gray-400 mb-4">
                      Upload a custom image to preview how your ad will look across social media platforms
                    </p>
                    
                    <input
                      ref={previewFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePreviewImageUpload}
                      className="hidden"
                    />
                    
                    {!previewImage ? (
                      <Button
                        onClick={handlePreviewImageClick}
                        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white py-4 rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-105"
                      >
                        <ImageIcon className="w-5 h-5 mr-2" />
                        Select Preview Image
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/50">
                          <img src={previewImage} alt="Preview" className="w-full h-48 object-cover" />
                          <div className="absolute top-2 right-2">
                            <Button
                              onClick={() => {
                                setPreviewImage(null);
                                localStorage.removeItem("adPreviewImage");
                                toast.success("Preview image removed");
                              }}
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          onClick={handlePreviewImageClick}
                          variant="outline"
                          className="w-full border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Change Preview Image
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <Button
                      size="lg"
                      onClick={() => {
                        // Save ad creative data to localStorage
                        const adCreativeData = {
                          caption: aiAnalysis.caption,
                          hashtags: aiAnalysis.hashtags,
                          platforms: platforms.filter(p => p.enabled).map(p => p.name)
                        };
                        localStorage.setItem("adCreativeData", JSON.stringify(adCreativeData));
                        navigate("/create-ad");
                      }}
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-6 rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-105"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Publish Now
                    </Button>
                    
                    <Button
                      size="lg"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
                    >
                      <Clock className="w-5 h-5 mr-2" />
                      Schedule Post
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Date</label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border-2 border-purple-500/30 text-white focus:border-cyan-400/50 focus:outline-none transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Time</label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border-2 border-purple-500/30 text-white focus:border-cyan-400/50 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SECTION 6 - Summary Panel (Centered) */}
              {analysisComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 via-purple-900/20 to-cyan-900/20 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20"
                >
                  <h3 className="text-xl text-white mb-6 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    Summary
                  </h3>
                  
                  {/* Content Preview */}
                  {uploadedFile?.preview && (
                    <div className="mb-6 rounded-xl overflow-hidden border-2 border-purple-500/30 max-w-md mx-auto">
                      {uploadedFile.file.type.startsWith('video/') ? (
                        <video 
                          src={uploadedFile.preview} 
                          className="w-full h-48 object-cover" 
                          controls
                          muted
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img src={uploadedFile.preview} alt="Preview" className="w-full h-48 object-cover" />
                      )}
                    </div>
                  )}
                  
                  {/* Platforms Selected */}
                  <div className="mb-6">
                    <h4 className="text-sm text-gray-400 mb-3 text-center">Platforms Selected</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {enabledPlatforms.map((platform) => {
                        const Icon = platform.icon;
                        return (
                          <div
                            key={platform.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r ${platform.color} shadow-lg`}
                          >
                            <Icon className="w-4 h-4 text-white" />
                            <span className="text-sm text-white">{platform.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-cyan-400" />
                          <span className="text-sm text-gray-400">Est. Reach</span>
                        </div>
                        <span className="text-lg text-white font-semibold">{estimatedReach.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-purple-400" />
                          <span className="text-sm text-gray-400">AI Score</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg text-white font-semibold">{aiScore}/100</span>
                          <div className="w-12 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                              style={{ width: `${aiScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-400" />
                          <span className="text-sm text-gray-400">Cost</span>
                        </div>
                        <span className="text-lg text-white font-semibold">Free</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
        </div>
      </div>

      {/* SECTION 7 - Footer */}
      <footer className="relative z-10 border-t border-purple-500/20 bg-gray-900/50 backdrop-blur-sm py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">
              VULPINIX AI 1.0
            </span>
            {" "}— Automate Your Digital World
          </p>
        </div>
      </footer>
    </motion.div>
  );
}