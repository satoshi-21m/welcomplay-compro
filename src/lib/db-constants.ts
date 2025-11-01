export const TABLES = {
  PORTFOLIO: 'portfolio',
  POSTS: 'posts',
  PORTFOLIO_CATEGORIES: 'portfolio_categories',
  PROJECT_TYPES: 'project_types',
  PORTFOLIO_TECHNOLOGIES: 'portfolio_technologies',
  TECHNOLOGIES: 'technologies',
} as const

export const PORTFOLIO_COLUMNS = [
  'id','title','description','slug','featured_image','featured_image_alt','is_active','is_featured',
  'portfolio_category_id','category_id','category','project_type_id','project_type','technologies',
  'project_url','github_url','meta_title','meta_description','meta_keywords','sort_order','created_at','updated_at'
] as const

export const POSTS_COLUMNS = [
  'id','title','slug','content','excerpt','category','status','featured_image','meta_title','meta_description','meta_keywords','is_featured','author_id','published_at','created_at','updated_at'
] as const


