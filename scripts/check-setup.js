#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Checking A2Z Backend Setup...\n');

let hasErrors = false;

// Check for .env file
if (!fs.existsSync('.env')) {
  console.log('❌ .env file not found');
  console.log('   Create .env file with your Supabase credentials');
  console.log('   See .env.example for template\n');
  hasErrors = true;
} else {
  console.log('✅ .env file exists');

  // Check for required variables
  const envContent = fs.readFileSync('.env', 'utf-8');
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'GEMINI_API_KEY'];

  requiredVars.forEach(varName => {
    if (envContent.includes(varName) && !envContent.includes(`${varName}=your_`)) {
      console.log(`   ✅ ${varName} is set`);
    } else {
      console.log(`   ❌ ${varName} is missing or not configured`);
      hasErrors = true;
    }
  });
}

// Check for node_modules
if (!fs.existsSync('node_modules')) {
  console.log('\n❌ node_modules not found');
  console.log('   Run: npm install\n');
  hasErrors = true;
} else {
  console.log('\n✅ Dependencies installed');
}

// Check for Supabase package
if (fs.existsSync('node_modules/@supabase/supabase-js')) {
  console.log('✅ Supabase client installed');
} else {
  console.log('❌ Supabase client not found');
  console.log('   Run: npm install\n');
  hasErrors = true;
}

console.log('\n' + '='.repeat(50));

if (!hasErrors) {
  console.log('\n✅ Setup is complete! You can start the app with:');
  console.log('\n   npm run dev\n');
  console.log('📚 Check SETUP_INSTRUCTIONS.md for detailed setup');
  console.log('📖 Check API_REFERENCE.md for API documentation');
} else {
  console.log('\n❌ Setup is incomplete. Please fix the issues above.');
  console.log('\n📚 See SETUP_INSTRUCTIONS.md for help');
}

console.log('\n' + '='.repeat(50) + '\n');

process.exit(hasErrors ? 1 : 0);
