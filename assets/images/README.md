# Image Assets for Exotic Expenditures

This directory contains all the images used in the Exotic Expenditures website. Below is a guide to the image requirements and organization structure to help maintain visual consistency.

## Directory Structure

- `/adventure-photos/`: Contains high-quality images of adventures and experiences
- `/webp/`: WebP optimized versions of the same images for better performance
- `/backgrounds/`: Background textures and patterns
- `/icons/`: Custom icons and SVG elements
- `/team/`: Photos of team members and testimonials

## Image Requirements

### Adventure Photos

- **Resolution**: 1920x1080px (16:9 ratio) for hero images, 800x600px for cards
- **Format**: JPG with 80% quality (300-500KB) with WebP alternatives
- **Style**: Vibrant, high-contrast, lifestyle photography showing groups enjoying experiences
- **Content**: Focus on showing people experiencing adventures, not just landscapes

### Hero Slideshow Images

Three primary images are needed for the hero slideshow:
1. `hero-1.jpg`: Group enjoying a helicopter mountain experience
2. `hero-2.jpg`: Zero gravity flight experience with excited participants
3. `hero-3.jpg`: Luxury dining experience in an exotic location

### Testimonial Images

- Circular crop, 300x300px
- Professional headshot style
- Consistent lighting and background style

### Event Images

- 800x600px
- Showcasing the specific event location/activity
- Should contain aspirational but realistic imagery

## Accessibility Considerations

- All images must have proper alt text in the HTML
- Avoid images with text embedded (use HTML overlays instead)
- Ensure sufficient contrast between images and overlaid text
- Consider users with photosensitive conditions when selecting images

## Performance Optimization

- All images should have WebP versions
- Use appropriate image sizes for different viewport sizes
- Consider using the `loading="lazy"` attribute for below-the-fold images
- Optimize file sizes without sacrificing quality (target: under 300KB per image)

## Image Sources

Recommended sources for high-quality, properly licensed images:
- Adobe Stock (paid)
- Unsplash (free)
- Pexels (free)
- iStock (paid)

Ensure all images have appropriate commercial licenses for use on the website.

## Responsible for Visual Assets: Agent 5

All visual design elements and images are managed by Agent 5, who ensures visual consistency and performance optimization across the website.