#!/usr/bin/env node
/**
 * Build Error Test and Accessibility Test Script
 * Runs comprehensive tests on the Valar Travel codebase
 */

import { execSync } from "child_process"
import { readFileSync, readdirSync, statSync } from "fs"
import { join, relative } from "path"

const ROOT_DIR = process.cwd()

const results = []

function log(message, type = "info") {
  const colors = {
    info: "\x1b[36m",
    success: "\x1b[32m",
    error: "\x1b[31m",
    warning: "\x1b[33m",
    reset: "\x1b[0m"
  }
  console.log(`${colors[type]}${message}${colors.reset}`)
}

function runCommand(command, description) {
  log(`\n>>> Running: ${description}`, "info")
  try {
    const output = execSync(command, { 
      encoding: "utf-8", 
      stdio: ["pipe", "pipe", "pipe"],
      cwd: ROOT_DIR 
    })
    return { success: true, output }
  } catch (error) {
    return { 
      success: false, 
      output: (error.stdout?.toString() || "") + (error.stderr?.toString() || error.message)
    }
  }
}

// =============================================================================
// TEST 1: TypeScript Type Checking
// =============================================================================
async function runTypeCheck() {
  const start = Date.now()
  const errors = []
  const warnings = []

  log("\n========================================", "info")
  log("TEST 1: TypeScript Type Checking", "info")
  log("========================================", "info")

  const { success, output } = runCommand("npx tsc --noEmit 2>&1", "TypeScript compiler")

  if (!success) {
    const lines = output.split("\n")
    lines.forEach(line => {
      if (line.includes("error TS")) {
        errors.push(line.trim())
      } else if (line.includes("warning")) {
        warnings.push(line.trim())
      }
    })
  }

  const passed = success || errors.length === 0
  log(passed ? "TypeScript check passed!" : `TypeScript check failed with ${errors.length} errors`, passed ? "success" : "error")

  if (errors.length > 0) {
    log("\nType Errors (first 20):", "error")
    errors.slice(0, 20).forEach(err => console.log(`  ${err}`))
    if (errors.length > 20) {
      log(`  ... and ${errors.length - 20} more errors`, "warning")
    }
  }

  return {
    name: "TypeScript Type Check",
    passed,
    errors,
    warnings,
    duration: Date.now() - start
  }
}

// =============================================================================
// TEST 2: ESLint Check
// =============================================================================
async function runLintCheck() {
  const start = Date.now()
  const errors = []
  const warnings = []

  log("\n========================================", "info")
  log("TEST 2: ESLint Check", "info")
  log("========================================", "info")

  const { success, output } = runCommand("npx next lint 2>&1", "ESLint")

  if (!success || output.includes("error")) {
    const lines = output.split("\n")
    lines.forEach(line => {
      if (line.includes("Error:") || line.includes("error")) {
        errors.push(line.trim())
      } else if (line.includes("Warning:") || line.includes("warning")) {
        warnings.push(line.trim())
      }
    })
  }

  const passed = success && errors.length === 0
  log(passed ? "ESLint check passed!" : `ESLint found ${errors.length} errors`, passed ? "success" : "error")

  if (errors.length > 0) {
    log("\nLint Errors (first 15):", "error")
    errors.slice(0, 15).forEach(err => console.log(`  ${err}`))
  }

  if (warnings.length > 0) {
    log(`\nLint Warnings: ${warnings.length}`, "warning")
  }

  return {
    name: "ESLint Check",
    passed,
    errors,
    warnings,
    duration: Date.now() - start
  }
}

// =============================================================================
// TEST 3: Accessibility Static Analysis
// =============================================================================
async function runAccessibilityCheck() {
  const start = Date.now()
  const errors = []
  const warnings = []

  log("\n========================================", "info")
  log("TEST 3: Accessibility Static Analysis", "info")
  log("========================================", "info")

  const a11yIssues = []

  function checkFile(filePath) {
    try {
      const content = readFileSync(filePath, "utf-8")
      const issues = []
      const relPath = relative(ROOT_DIR, filePath)

      // Check for images without alt text
      const imgMatches = content.match(/<img[^>]*>/gi) || []
      imgMatches.forEach((img, i) => {
        if (!img.includes("alt=") && !img.includes("alt =")) {
          issues.push(`Line ~${i + 1}: <img> missing alt attribute`)
        } else if (img.match(/alt=["']\s*["']/)) {
          warnings.push(`${relPath}: <img> has empty alt attribute (ensure it's decorative)`)
        }
      })

      // Check for Next.js Image without alt
      const nextImgMatches = content.match(/<Image[^>]*>/gi) || []
      nextImgMatches.forEach((img, i) => {
        if (!img.includes("alt=") && !img.includes("alt =")) {
          issues.push(`Line ~${i + 1}: <Image> missing alt attribute`)
        }
      })

      // Check for buttons without accessible text
      const iconButtonMatches = content.match(/<button[^>]*>\s*<[^>]+\/>\s*<\/button>/gi) || []
      iconButtonMatches.forEach((btn, i) => {
        if (!btn.includes("aria-label") && !btn.includes("sr-only") && !btn.includes("title=")) {
          issues.push(`Line ~${i + 1}: Icon-only button missing aria-label or sr-only text`)
        }
      })

      // Check for links without accessible text
      const linkMatches = content.match(/<a[^>]*>[^<]*<\/a>/gi) || []
      linkMatches.forEach((link, i) => {
        if (link.match(/<a[^>]*>\s*<\/a>/)) {
          issues.push(`Line ~${i + 1}: Empty <a> link found`)
        }
      })

      // Check for form inputs without labels
      const inputMatches = content.match(/<input[^>]*>/gi) || []
      inputMatches.forEach((input) => {
        if (input.includes('type="hidden"')) return
        if (!input.includes("aria-label") && !input.includes("id=")) {
          warnings.push(`${relPath}: <input> may be missing associated label`)
        }
      })

      // Check for heading hierarchy issues
      const hasH3BeforeH2 = content.indexOf("<h3") < content.indexOf("<h2") && content.includes("<h3") && content.includes("<h2")
      if (hasH3BeforeH2) {
        warnings.push(`${relPath}: Heading hierarchy may be incorrect (h3 before h2)`)
      }

      // Check for onclick on non-interactive elements
      const onClickDivs = content.match(/<div[^>]*onClick/gi) || []
      onClickDivs.forEach((div, i) => {
        if (!div.includes("role=") && !div.includes("tabIndex")) {
          issues.push(`Line ~${i + 1}: onClick on div without role or tabIndex`)
        }
      })

      // Check for proper ARIA usage
      if (content.includes('role="button"') && !content.includes("tabIndex")) {
        warnings.push(`${relPath}: Element with role="button" may need tabIndex`)
      }

      // Check for color contrast issues
      if (content.match(/text-gray-[34]00/) && !content.includes("dark:")) {
        warnings.push(`${relPath}: Light gray text (gray-300/400) may have contrast issues`)
      }

      // Check for autoplay video/audio without controls
      if (content.includes("autoPlay") && !content.includes("controls")) {
        if (content.includes("<video") || content.includes("<audio")) {
          warnings.push(`${relPath}: Autoplay media should have controls or be muted`)
        }
      }

      if (issues.length > 0) {
        a11yIssues.push({ file: relPath, issues })
        issues.forEach(issue => errors.push(`${relPath}: ${issue}`))
      }
    } catch (e) {
      // Skip files that can't be read
    }
  }

  function walkDir(dir) {
    try {
      const files = readdirSync(dir)
      files.forEach(file => {
        const fullPath = join(dir, file)
        try {
          const stat = statSync(fullPath)
          if (stat.isDirectory() && !file.includes("node_modules") && !file.startsWith(".")) {
            walkDir(fullPath)
          } else if (file.endsWith(".tsx") || file.endsWith(".jsx")) {
            checkFile(fullPath)
          }
        } catch (e) {
          // Skip inaccessible paths
        }
      })
    } catch (e) {
      // Skip inaccessible directories
    }
  }

  walkDir(join(ROOT_DIR, "app"))
  walkDir(join(ROOT_DIR, "components"))

  const passed = errors.length === 0
  log(passed ? "Accessibility check passed!" : `Found ${errors.length} accessibility issues`, passed ? "success" : "error")

  if (a11yIssues.length > 0) {
    log("\nAccessibility Issues by File:", "error")
    a11yIssues.slice(0, 10).forEach(({ file, issues }) => {
      console.log(`\n  ${file}:`)
      issues.forEach(issue => console.log(`    - ${issue}`))
    })
    if (a11yIssues.length > 10) {
      log(`\n  ... and ${a11yIssues.length - 10} more files with issues`, "warning")
    }
  }

  if (warnings.length > 0) {
    log(`\nAccessibility Warnings: ${warnings.length}`, "warning")
    warnings.slice(0, 10).forEach(w => console.log(`  - ${w}`))
  }

  return {
    name: "Accessibility Check",
    passed,
    errors,
    warnings,
    duration: Date.now() - start
  }
}

// =============================================================================
// TEST 4: Build Validation (without full build due to experimental.ppr)
// =============================================================================
async function runBuildValidation() {
  const start = Date.now()
  const errors = []
  const warnings = []

  log("\n========================================", "info")
  log("TEST 4: Build Validation", "info")
  log("========================================", "info")
  log("Note: Full build skipped (experimental.ppr requires Next.js canary)", "warning")

  function checkBuildIssues(filePath) {
    try {
      const content = readFileSync(filePath, "utf-8")
      const relPath = relative(ROOT_DIR, filePath)

      // Check for server/client component issues
      if (content.includes('"use client"') || content.includes("'use client'")) {
        if (content.includes("import { headers }") || content.includes("import { cookies }")) {
          errors.push(`${relPath}: Client component imports server-only functions`)
        }
      }

      // Check for missing default exports in pages/layouts
      if ((filePath.includes("/page.") || filePath.includes("/layout.")) && 
          !content.includes("export default")) {
        errors.push(`${relPath}: Missing default export`)
      }

      // Check for async component with useState
      if (content.includes("async function") && content.includes("useState")) {
        warnings.push(`${relPath}: Async component with useState may cause issues`)
      }

    } catch (e) {
      // Skip files that can't be read
    }
  }

  function walkDir(dir) {
    try {
      const files = readdirSync(dir)
      files.forEach(file => {
        const fullPath = join(dir, file)
        try {
          const stat = statSync(fullPath)
          if (stat.isDirectory() && !file.includes("node_modules") && !file.startsWith(".")) {
            walkDir(fullPath)
          } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
            checkBuildIssues(fullPath)
          }
        } catch (e) {
          // Skip inaccessible paths
        }
      })
    } catch (e) {
      // Skip inaccessible directories
    }
  }

  walkDir(join(ROOT_DIR, "app"))
  walkDir(join(ROOT_DIR, "components"))
  walkDir(join(ROOT_DIR, "lib"))

  // Validate critical files exist
  const criticalFiles = ["app/layout.tsx", "app/page.tsx", "next.config.mjs", "package.json", "tsconfig.json"]
  criticalFiles.forEach(file => {
    try {
      statSync(join(ROOT_DIR, file))
    } catch (e) {
      errors.push(`Missing critical file: ${file}`)
    }
  })

  const passed = errors.length === 0
  log(passed ? "Build validation passed!" : `Build validation found ${errors.length} issues`, passed ? "success" : "error")

  if (errors.length > 0) {
    log("\nBuild Issues:", "error")
    errors.slice(0, 15).forEach(err => console.log(`  - ${err}`))
  }

  return {
    name: "Build Validation",
    passed,
    errors,
    warnings,
    duration: Date.now() - start
  }
}

// =============================================================================
// TEST 5: Security Check
// =============================================================================
async function runSecurityCheck() {
  const start = Date.now()
  const errors = []
  const warnings = []

  log("\n========================================", "info")
  log("TEST 5: Security Check", "info")
  log("========================================", "info")

  function checkSecurityIssues(filePath) {
    try {
      const content = readFileSync(filePath, "utf-8")
      const relPath = relative(ROOT_DIR, filePath)

      // Check for hardcoded secrets
      const secretPatterns = [
        /api[_-]?key\s*[:=]\s*["'][^"']+["']/gi,
        /secret\s*[:=]\s*["'][^"']+["']/gi,
        /password\s*[:=]\s*["'][^"']+["']/gi,
      ]
      secretPatterns.forEach(pattern => {
        if (pattern.test(content) && !content.includes("process.env")) {
          warnings.push(`${relPath}: Potential hardcoded secret detected`)
        }
      })

      // Check for dangerouslySetInnerHTML
      if (content.includes("dangerouslySetInnerHTML")) {
        warnings.push(`${relPath}: Uses dangerouslySetInnerHTML - ensure content is sanitized`)
      }

      // Check for eval usage
      if (content.match(/\beval\s*\(/)) {
        errors.push(`${relPath}: Uses eval() - security risk`)
      }

    } catch (e) {
      // Skip files that can't be read
    }
  }

  function walkDir(dir) {
    try {
      const files = readdirSync(dir)
      files.forEach(file => {
        const fullPath = join(dir, file)
        try {
          const stat = statSync(fullPath)
          if (stat.isDirectory() && !file.includes("node_modules") && !file.startsWith(".")) {
            walkDir(fullPath)
          } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
            checkSecurityIssues(fullPath)
          }
        } catch (e) {
          // Skip inaccessible paths
        }
      })
    } catch (e) {
      // Skip inaccessible directories
    }
  }

  walkDir(join(ROOT_DIR, "app"))
  walkDir(join(ROOT_DIR, "components"))
  walkDir(join(ROOT_DIR, "lib"))

  const passed = errors.length === 0
  log(passed ? "Security check passed!" : `Security check found ${errors.length} critical issues`, passed ? "success" : "error")

  if (errors.length > 0) {
    log("\nSecurity Issues:", "error")
    errors.forEach(err => console.log(`  - ${err}`))
  }

  if (warnings.length > 0) {
    log(`\nSecurity Warnings: ${warnings.length}`, "warning")
    warnings.slice(0, 10).forEach(w => console.log(`  - ${w}`))
  }

  return {
    name: "Security Check",
    passed,
    errors,
    warnings,
    duration: Date.now() - start
  }
}

// =============================================================================
// MAIN
// =============================================================================
async function main() {
  console.log("\n")
  log("╔════════════════════════════════════════════════════════════╗", "info")
  log("║     VALAR TRAVEL - BUILD & ACCESSIBILITY TEST SUITE        ║", "info")
  log("╚════════════════════════════════════════════════════════════╝", "info")

  const startTime = Date.now()

  // Run all tests
  results.push(await runTypeCheck())
  results.push(await runLintCheck())
  results.push(await runAccessibilityCheck())
  results.push(await runBuildValidation())
  results.push(await runSecurityCheck())

  // Print summary
  log("\n\n========================================", "info")
  log("           TEST SUMMARY", "info")
  log("========================================\n", "info")

  let totalErrors = 0
  let totalWarnings = 0
  let passedCount = 0

  results.forEach(result => {
    const status = result.passed ? "PASS" : "FAIL"
    const statusColor = result.passed ? "success" : "error"
    log(`${status} - ${result.name} (${result.duration}ms)`, statusColor)
    console.log(`     Errors: ${result.errors.length}, Warnings: ${result.warnings.length}`)
    
    totalErrors += result.errors.length
    totalWarnings += result.warnings.length
    if (result.passed) passedCount++
  })

  const totalTime = Date.now() - startTime

  log("\n========================================", "info")
  log(`Total: ${passedCount}/${results.length} tests passed`, passedCount === results.length ? "success" : "warning")
  log(`Errors: ${totalErrors}, Warnings: ${totalWarnings}`, totalErrors > 0 ? "error" : "info")
  log(`Duration: ${totalTime}ms`, "info")
  log("========================================\n", "info")

  process.exit(totalErrors > 0 ? 1 : 0)
}

main().catch(err => {
  console.error("Test suite failed:", err)
  process.exit(1)
})
