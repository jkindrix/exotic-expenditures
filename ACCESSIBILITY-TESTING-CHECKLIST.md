# Accessibility Testing Checklist

This checklist provides a comprehensive guide for testing accessibility on the Exotic Expenditures website. Follow these steps to ensure WCAG 2.1 AA compliance.

## Semantic HTML Structure

- [ ] All pages use appropriate HTML5 semantic elements (`header`, `main`, `nav`, `section`, `article`, `footer`)
- [ ] Proper heading hierarchy (`h1` through `h6`) is maintained
- [ ] ARIA landmarks are used correctly where needed (`role="banner"`, `role="navigation"`, etc.)
- [ ] HTML is valid and well-formed

## Keyboard Navigation

- [ ] All interactive elements are keyboard accessible
- [ ] Focus order is logical and follows visual layout
- [ ] Focus indicators are clearly visible
- [ ] Skip link is provided and functions correctly
- [ ] No keyboard traps (areas where keyboard focus cannot escape)
- [ ] Custom widgets have proper keyboard controls
- [ ] Dropdown menus are accessible via keyboard

## Screen Reader Compatibility

- [ ] All images have appropriate alt text
- [ ] Decorative images have empty alt attributes or are set as background images
- [ ] Form fields have properly associated labels
- [ ] ARIA attributes are used correctly and don't conflict with native semantics
- [ ] Custom controls have appropriate ARIA roles, states, and properties
- [ ] Dynamic content changes are announced to screen readers
- [ ] SVGs have proper accessibility attributes

## Text Alternatives & Media

- [ ] All non-text content has text alternatives
- [ ] Audio content has transcripts
- [ ] Video content has captions and audio descriptions where needed
- [ ] No information is conveyed through color alone
- [ ] Icons that convey meaning have text alternatives

## Color & Visual Design

- [ ] Color contrast ratios meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- [ ] No information is conveyed through color alone
- [ ] Text is readable when zoomed to 200%
- [ ] UI remains functional at 200% zoom
- [ ] Content is visible in Windows High Contrast mode
- [ ] Interactive elements have visible :hover and :focus states
- [ ] Text can be resized without loss of content or functionality

## Forms & Input

- [ ] All form fields have associated labels
- [ ] Required fields are clearly indicated
- [ ] Error messages are clearly linked to form fields
- [ ] Form validation provides clear instructions for correction
- [ ] Autocompletion attributes are used where appropriate
- [ ] Time limits are adjustable or have warnings

## Navigation & Orientation

- [ ] Page title is descriptive and unique
- [ ] Current location is indicated in navigation
- [ ] Links have descriptive text (not "click here" or "read more")
- [ ] Multiple ways to find content are provided (search, sitemap, navigation)
- [ ] Focus is managed appropriately when content changes

## Motion & Animation

- [ ] `prefers-reduced-motion` is respected
- [ ] No content flashes more than 3 times per second
- [ ] Animations can be paused, stopped, or hidden
- [ ] Auto-playing content can be paused or stopped
- [ ] No content relies solely on motion to convey information

## Device Compatibility

- [ ] Content works on touch devices
- [ ] Touch targets are at least 44x44 pixels
- [ ] Content works in both portrait and landscape orientations
- [ ] Gestures have alternatives
- [ ] Device motion can be disabled
- [ ] Content works across different viewport sizes

## Cognitive Considerations

- [ ] Reading level is appropriate for the target audience
- [ ] Complex terms are defined
- [ ] Abbreviations are expanded on first use
- [ ] Content is organized with clear headings and sections
- [ ] Instructions are clear and don't rely on sensory characteristics

## Tools to Use for Testing

1. **Automated Testing**
   - Lighthouse (in Chrome DevTools)
   - axe DevTools (browser extension)
   - WAVE Web Accessibility Evaluation Tool
   - HTML and CSS validators

2. **Manual Testing**
   - Keyboard-only navigation
   - Screen readers (NVDA, VoiceOver, JAWS)
   - Browser zoom (up to 200%)
   - Windows High Contrast mode
   - Mobile device testing

3. **Expert Review**
   - Review by accessibility specialist
   - User testing with people who use assistive technologies

## Pre-release Checklist

Before any release, verify:

1. [ ] Accessibility issues from previous releases are addressed
2. [ ] New features have been tested for accessibility
3. [ ] Automated tests show no critical issues
4. [ ] Site has been manually tested with keyboard navigation
5. [ ] Site has been tested with at least one screen reader
6. [ ] Color contrast meets standards throughout the site
7. [ ] Forms are accessible and provide proper error handling
8. [ ] Touch targets are appropriately sized for mobile
9. [ ] Animations respect `prefers-reduced-motion`
10. [ ] Documentation is updated with any known accessibility issues

## Additional Resources

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [W3C WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [The A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Deque University](https://dequeuniversity.com/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Learn/Accessibility)