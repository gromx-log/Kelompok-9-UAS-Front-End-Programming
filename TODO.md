# TODO: Fix Edit CMS Feature for Products

## Tasks
- [x] Modify `client/src/app/cms/products/edit/[id]/page.tsx`:
  - [x] Add `images` field to `ProductForm` interface.
  - [x] Update `fetchProduct` to include `images` in `formData`.
  - [x] Change API calls to use relative paths (`/api/products/${id}`) instead of full URLs.
  - [x] In `handleSubmit`, append 'existingImages' as JSON string if no new image file is selected; otherwise, append 'images' for replacement.

## Followup Steps
- [x] Test the edit feature by attempting to edit a product with and without image changes.
- [x] Verify no errors occur and data is updated correctly.
