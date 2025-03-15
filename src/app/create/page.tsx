"use client";
import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  Upload,
  Image,
  Quote,
  Download,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Trash2,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS, Transform } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";

// Draggable components
const DraggablePhoto = ({
  id,
  src,
  onRemove,
  isSelected,
  onClick,
  transform,
}: {
  id: string;
  src: string;
  onRemove: (id: string) => void;
  isSelected: boolean;
  onClick: () => void;
  transform: Transform;
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });
  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isSelected ? 10 : 1,
    height: "150px",
    width: "auto",
    maxWidth: "200px",
    position: "absolute",
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`cursor-move rounded-md overflow-hidden border-2 ${
        isSelected ? "border-blue-500" : "border-transparent"
      }`}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <img
        src={src}
        alt="User uploaded"
        className="h-full w-full object-cover"
      />
      {isSelected && (
        <Button
          size="sm"
          variant="destructive"
          className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

const DraggableQuote = ({
  id,
  text,
  onRemove,
  isSelected,
  onClick,
  transform,
}: {
  id: string;
  text: string;
  onRemove: (id: string) => void;
  isSelected: boolean;
  onClick: () => void;
  transform: Transform;
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isSelected ? 10 : 1,
    position: "absolute",
    maxWidth: "250px",
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`cursor-move p-3 glass rounded-lg shadow-sm ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <blockquote className="text-gray-700 italic text-sm">
        &quot;{text}&quot;
      </blockquote>
      {isSelected && (
        <Button
          size="sm"
          variant="destructive"
          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

const Create = () => {
  //   const navigate = useNavigate();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upload");
  const [conversation, setConversation] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [memoryItems, setMemoryItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [extractedQuotes, setExtractedQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [quote, setQuote] = useState<string>("");

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      toast.error("You can only upload up to 5 photos.");
      return;
    }

    const newPhotos = [...photos] as File[];
    const newPreviews = [...photoPreview] as string[];

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        newPhotos.push(file);

        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target) {
            newPreviews.push(event.target.result as string);
            setPhotoPreview([...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    setPhotos(newPhotos);
  };

  // Extract quotes from conversation
  // const extractQuotes = () => {
  //   if (!conversation.trim()) {
  //     toast.error("Please enter a conversation transcript first.");
  //     return;
  //   }

  //   // Simple quote extraction - get sentences with quotes or that end with exclamation/question marks
  //   const sentences = conversation.match(/[^.!?]+[.!?]+/g) || [];

  //   const quotes = sentences
  //     .filter((sentence) => {
  //       const trimmed = sentence.trim();
  //       return (
  //         trimmed.includes('"') ||
  //         trimmed.includes('"') ||
  //         trimmed.includes("'") ||
  //         trimmed.endsWith("!") ||
  //         trimmed.endsWith("?")
  //       );
  //     })
  //     .map((sentence) => sentence.trim().replace(/["""]/g, ""));

  //   // Take up to 5 quotes
  //   const limitedQuotes = quotes.slice(0, 5);

  //   if (limitedQuotes.length === 0) {
  //     // If no quotes detected, just take the first few sentences
  //     setExtractedQuotes(sentences.slice(0, 3));
  //   } else {
  //     setExtractedQuotes(limitedQuotes);
  //   }

  //   toast.success(
  //     `${
  //       limitedQuotes.length > 0
  //         ? limitedQuotes.length
  //         : sentences.slice(0, 3).length
  //     } quotes extracted!`
  //   );
  // };

  const getRandomPosition = (
    canvasWidth: number,
    canvasHeight: number,
    itemWidth: number,
    itemHeight: number,
    existingItems: any
  ) => {
    const maxAttempts = 100; // Maximum attempts to find a non-overlapping position
    let attempts = 0;

    while (attempts < maxAttempts) {
      const x = Math.random() * (canvasWidth - itemWidth);
      const y = Math.random() * (canvasHeight - itemHeight);

      // Check if the new position overlaps with any existing item
      const overlaps = existingItems.some((item) => {
        return (
          x < item.position.x + itemWidth &&
          x + itemWidth > item.position.x &&
          y < item.position.y + itemHeight &&
          y + itemHeight > item.position.y
        );
      });

      if (!overlaps) {
        return { x, y };
      }

      attempts++;
    }

    // If no non-overlapping position is found, return a fallback position
    return { x: 0, y: 0 };
  };
  // Add item to canvas
  const addItemToCanvas = (type, content) => {
    const randomPosition = getRandomPosition(300, 200, 200, 150, memoryItems);
    const newItem = {
      id: `${type}-${Date.now()}`,
      type,
      content,
      position: {
        x: randomPosition.x,
        y: randomPosition.y,
      },
      size: {
        width: 200,
        height: 150,
      },
    };

    setMemoryItems([...memoryItems, newItem]);
    setSelectedItemId(newItem.id);
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, delta } = event;

    setMemoryItems((items) =>
      items.map((item) => {
        if (item.id === active.id) {
          return {
            ...item,
            position: {
              x: item.position.x + delta.x,
              y: item.position.y + delta.y,
            },
          };
        }
        return item;
      })
    );
  };

  // Remove item from canvas
  const removeItem = (id: string) => {
    setMemoryItems((items) => items.filter((item) => item.id !== id));
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
  };

  // Download canvas as image
  const downloadCanvas = () => {
    if (!canvasRef.current || memoryItems.length === 0) {
      toast.error("Add some items to your canvas first!");
      return;
    }

    // Use html2canvas for actual implementation
    toast.success("Your memory has been downloaded!");
  };

  // When upload is complete, move to design tab
  const handleUploadComplete = async () => {
    if (!conversation.trim()) {
      toast.error("Please enter a conversation transcript.");
      return;
    }

    if (photos.length === 0) {
      toast.error("Please upload at least one photo.");
      return;
    }
    // const response = await fetch("/api/image", {
    //   method: "POST",
    //   body: JSON.stringify({ quote: conversation }),
    // });
    // const quoteRaw = await fetch("/api/quote", {
    //   method: "POST",
    //   body: JSON.stringify({ quote: conversation }),
    // });
    const [quoteRaw, response] = await Promise.all([
      fetch("/api/quote", {
        method: "POST",
        body: JSON.stringify({ quote: conversation }),
      }),
      fetch("/api/image", {
        method: "POST",
        body: JSON.stringify({ quote: conversation }),
      }),
    ]);
    // console.log(quoteRaw);
    const quoteData = await quoteRaw.json();
    // console.log(quoteData);
    setQuote(quoteData.quote);
    const data = await response.json();
    // console.log(data);
    // console.log(data[0].url);
    setBackgroundImage(data[0].url);
    // console.log(backgroundImage);
    // Extract quotes and then proceed to design tab
    // extractQuotes();
    setPhotoPreview([]);
    setPhotos([]);
    setMemoryItems([]);
    for (let i = 0; i < photos.length; i++) {
      addItemToCanvas("photo", photoPreview[i]);
    }
    addItemToCanvas("quote", quoteData.quote);
    setActiveTab("design");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 rounded-full"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Button>

        <h1 className="text-3xl font-bold tracking-tight mb-8">
          Create your memory
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-2 mb-8">
            <TabsTrigger value="upload" className="rounded-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Content
            </TabsTrigger>
            <TabsTrigger value="design" className="rounded-full">
              <Image className="h-4 w-4 mr-2" />
              Design Layout
            </TabsTrigger>
          </TabsList>

          {/* Upload Content Tab */}
          <TabsContent value="upload" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="conversation">Conversation Transcript</Label>
                  <Textarea
                    id="conversation"
                    placeholder="Paste your conversation (100-500 words)..."
                    className="h-52 resize-none"
                    value={conversation}
                    onChange={(e) => setConversation(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    {conversation.split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photos">Photos</Label>
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-all-ease"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Click to upload photos (up to 5)
                    </p>
                  </div>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    id="photos"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-gray-500">
                    {photos.length}/5 photos uploaded
                  </p>
                </div>

                {photoPreview.length > 0 && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="flex flex-wrap gap-2">
                      {photoPreview.map((preview, index) => (
                        <img
                          key={index}
                          src={preview}
                          alt="Preview"
                          className="h-20 w-20 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleUploadComplete}
                  className="w-full rounded-full"
                >
                  Continue to design
                </Button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="text-lg font-medium">Tips for great results</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    Choose photos that relate to moments mentioned in the
                    conversation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    Include emotional or funny quotes from the conversation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    Make sure your conversation has clear speakers and dialogue
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    The more detailed your conversation, the better quotes we
                    can extract
                  </li>
                </ul>

                <div className="p-4 bg-blue-50 rounded-lg mt-4">
                  <p className="text-sm text-blue-700">
                    Your photos and conversation are processed entirely in your
                    browser and never stored on our servers.
                  </p>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Design Layout Tab */}
          <TabsContent value="design" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Image className="h-4 w-4 mr-2" />
                    Photos
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {photoPreview.map((preview, index) => (
                      <div
                        key={index}
                        className="relative cursor-pointer hover:opacity-90 transition-all-ease"
                        onClick={() => addItemToCanvas("photo", preview)}
                      >
                        <img
                          src={preview}
                          alt="Preview"
                          className="h-16 w-full object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Quote className="h-4 w-4 mr-2" />
                    Quotes
                  </h3>
                  <div className="space-y-2">
                    <div
                      className="p-2 bg-gray-50 rounded text-sm cursor-pointer hover:bg-gray-100 transition-all-ease"
                      onClick={() => addItemToCanvas("quote", quote)}
                    >
                      {quote.length > 40
                        ? quote.substring(0, 40) + "..."
                        : quote}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={downloadCanvas}
                  className="w-full rounded-full flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Creation
                </Button>
              </div>

              {/* Canvas */}
              <div className="lg:col-span-3">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full h-8 w-8 p-0"
                      >
                        <Undo className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full h-8 w-8 p-0"
                      >
                        <Redo className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full h-8 w-8 p-0"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full h-8 w-8 p-0"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div
                    ref={canvasRef}
                    className="relative w-full aspect-video bg-gray-50 rounded-lg overflow-hidden"
                    onClick={() => setSelectedItemId(null)}
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                  >
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                      modifiers={[restrictToParentElement]}
                    >
                      {memoryItems.map((item) => {
                        if (item.type === "photo") {
                          return (
                            <DraggablePhoto
                              key={item.id}
                              id={item.id}
                              src={item.content}
                              transform={{
                                x: item.position.x,
                                y: item.position.y,
                              }}
                              isSelected={selectedItemId === item.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItemId(item.id);
                              }}
                              onRemove={removeItem}
                            />
                          );
                        } else if (item.type === "quote") {
                          return (
                            <DraggableQuote
                              key={item.id}
                              id={item.id}
                              text={item.content}
                              transform={{
                                x: item.position.x,
                                y: item.position.y,
                              }}
                              isSelected={selectedItemId === item.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItemId(item.id);
                              }}
                              onRemove={removeItem}
                            />
                          );
                        }
                        return null;
                      })}
                    </DndContext>

                    {memoryItems.length === 0 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <Image className="h-8 w-8 mb-2 opacity-50" />
                        <p className="text-sm">Drag photos and quotes here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Create;
