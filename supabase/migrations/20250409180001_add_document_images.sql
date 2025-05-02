/*
  # Add document image support

  1. Modify checklist_items
    - Add image_url column for documents to store URLs of uploaded images
*/

-- Add image_url column to checklist_items
ALTER TABLE public.checklist_items
ADD COLUMN IF NOT EXISTS image_url text; 