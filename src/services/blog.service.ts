import { PrismaClient } from "@prisma/client";
import { AppError } from "@/utils/appError";

const prisma = new PrismaClient();

export class BlogService {
  // GET /api/blog — List all posts (with optional filters)
  async getAll(filters: any = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const { category, tag } = filters;

    const where: any = {};
    if (category) where.categories = { has: category };
    if (tag) where.tags = { has: tag };

    const posts = await prisma.blogPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: { publishedDate: "desc" },
      select: {
        postId: true,
        title: true,
        content: true,
        author: true,
        categories: true,
        tags: true,
        publishedDate: true,
        createdAt: true,
      },
    });

    return posts;
  }

  // GET /api/blog/:postId — Get single post by ID
  async getById(postId: string) {
    const post = await prisma.blogPost.findUnique({
      where: { postId },
      include: { comments: true },
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    return post;
  }

  // POST /api/blog — Create a new blog post
  async create(data: {
    title: string;
    content: string;
    author: string;
    categories?: string[];
    tags?: string[];
    publishedDate?: Date;
  }) {
    const newPost = await prisma.blogPost.create({
      data,
      select: {
        postId: true,
        title: true,
        author: true,
        publishedDate: true,
      },
    });

    return newPost;
  }

  // PUT /api/blog/:postId — Update a post
  async update(
    postId: string,
    data: Partial<{
      title: string;
      content: string;
      categories: string[];
      tags: string[];
      publishedDate: Date;
    }>
  ) {
    const existingPost = await prisma.blogPost.findUnique({ where: { postId } });
    if (!existingPost) {
      throw new AppError("Post not found", 404);
    }

    return prisma.blogPost.update({
      where: { postId },
      data,
      select: {
        postId: true,
        title: true,
        updatedAt: true,
      },
    });
  }

  // DELETE /api/blog/:postId — Delete a post
  async delete(postId: string) {
    const existingPost = await prisma.blogPost.findUnique({ where: { postId } });
    if (!existingPost) {
      throw new AppError("Post not found", 404);
    }

    await prisma.blogPost.delete({ where: { postId } });
  }

  // POST /api/blog/:postId/comments — Add a comment
  async addComment(
    postId: string,
    comment: {
      author: string;
      content: string;
    }
  ) {
    const post = await prisma.blogPost.findUnique({ where: { postId } });
    if (!post) throw new AppError("Post not found", 404);

    const newComment = await prisma.comment.create({
      data: {
        postId,
        author: comment.author,
        content: comment.content,
      },
    });

    return newComment;
  }

  // PUT /api/blog/:postId/comments/:commentId/approve — Approve a comment
async approveComment(postId: string, commentId: string) {
  const updatedComment = await prisma.comment.update({
    where: { commentId },
    data: { approved: true },
  });
  return updatedComment;
}

}

