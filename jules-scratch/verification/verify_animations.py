from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 720})
    page = context.new_page()

    try:
        page.goto("http://localhost:3000", wait_until="networkidle")

        # Wait for the hero section to be visible and take a screenshot
        hero_header = page.get_by_role("heading", name="Are Your Emails Landing in Spam Folders?")
        expect(hero_header).to_be_visible(timeout=10000)
        page.wait_for_timeout(1000) # Wait for animation
        page.screenshot(path="jules-scratch/verification/01_hero_section.png")

        # Scroll to the features section, wait for it to be visible, and take a screenshot
        features_section = page.locator("#features")
        features_section.scroll_into_view_if_needed()
        expect(features_section.get_by_role("heading", name="Why Choose InboxShield Mini")).to_be_visible(timeout=5000)
        page.wait_for_timeout(1000) # Wait for animation
        page.screenshot(path="jules-scratch/verification/02_features_section.png")

        # Scroll to the "How It Works" section, wait for it, and take a screenshot
        how_it_works_section = page.locator("#how-it-works")
        how_it_works_section.scroll_into_view_if_needed()
        expect(how_it_works_section.get_by_role("heading", name="How InboxShield Functions")).to_be_visible(timeout=5000)
        page.wait_for_timeout(1000) # Wait for animation
        page.screenshot(path="jules-scratch/verification/03_how_it_works_section.png")

        # Scroll to the pricing section, wait for it, and take a screenshot
        pricing_section = page.locator("#pricing")
        pricing_section.scroll_into_view_if_needed()
        expect(pricing_section.get_by_role("heading", name="Straightforward Pricing")).to_be_visible(timeout=5000)
        page.wait_for_timeout(1000) # Wait for animation
        page.screenshot(path="jules-scratch/verification/04_pricing_section.png")

    except Exception as e:
        print(f"An error occurred during Playwright execution: {e}")
        page.screenshot(path="jules-scratch/verification/error_screenshot.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)