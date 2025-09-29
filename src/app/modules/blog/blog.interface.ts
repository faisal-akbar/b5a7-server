export interface IBlogFilterRequest {
  searchTerm?: string | undefined;
  tags?: string | undefined;
  isFeatured?: boolean | undefined;
  isPublished?: boolean | undefined;
}
