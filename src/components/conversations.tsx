import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { AvatarFallback,Avatar, AvatarImage} from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useState, useMemo } from "react";

interface Conversation { id: string | null; matchId: string; otherUserId: string; name: string; image: string; lastMessage: { id: string; content: string; senderId: string; createdAt: Date; updatedAt: Date; conversationId: string; read: boolean; } | null; unreadCount: number; createdAt: Date; updatedAt: Date; }

export const Conversations = ({
    filteredConversations,
    unreadCounts,
}:any) =>{
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1;
    const totalPages = Math.ceil(filteredConversations.length / itemsPerPage);
   
    const paginatedConversations = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredConversations.slice(startIndex, endIndex);
    }, [currentPage, filteredConversations]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleConversationClick = (conversation: Conversation) => {
        if (conversation.matchId) {
            router.push(`/dashboard/messages/${conversation.matchId}`);
        }
    };

    return (
        <AnimatePresence>
            <div className="divide-y divide-border">
                {paginatedConversations.map((conversation:any) => {
                    const unreadCount = unreadCounts?.byConversation[conversation.id || ""] || 0;
                    return (
                        <motion.div
                            key={conversation.id || conversation.matchId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={cn(
                                "group flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-all duration-200",
                                unreadCount > 0 && "bg-muted/30"
                            )}
                            onClick={() => handleConversationClick(conversation)}
                        >
                            <Avatar className="h-14 w-14 transition-all duration-200">
                                <AvatarImage src={conversation.image} />
                                <AvatarFallback className="text-lg">
                                    {conversation.name.substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-lg truncate">
                                        {conversation.name}
                                    </h3>
                                    {conversation.lastMessage && (
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                            {formatDistanceToNow(
                                                new Date(conversation.lastMessage.createdAt),
                                                { addSuffix: true }
                                            )}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate flex items-center gap-2">
                                    {conversation.lastMessage ? (
                                        <>
                                            <span className="truncate">
                                                {conversation.lastMessage.content}
                                            </span>
                                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </>
                                    ) : (
                                        "Start a conversation"
                                    )}
                                </p>
                            </div>
                            {unreadCount > 0 && (
                                <div className="bg-primary text-primary-foreground rounded-full min-w-[24px] h-6 px-2 flex items-center justify-center text-sm font-medium">
                                    {unreadCount}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
            {totalPages > 1 && (
                <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                onClick={() => handlePageChange(currentPage - 1)}
                                className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index + 1}>
                                <PaginationLink
                                    onClick={() => handlePageChange(index + 1)}
                                    isActive={currentPage === index + 1}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext 
                                onClick={() => handlePageChange(currentPage + 1)}
                                className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </AnimatePresence>
    );
}