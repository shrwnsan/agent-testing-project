#!/bin/bash

# Agent Testing Automation Script

ACTION=""

# Help function
show_help() {
    echo "Agent Testing Automation Script"
    echo ""
    echo "This script automates the agent testing workflow."
    echo ""
    echo "Usage:"
    echo "  $0 {start|finish}"
    echo ""
    echo "Commands:"
    echo "  start     Prepare a clean testing environment"
    echo "  finish    Complete testing and prepare for results"
    echo ""
    echo "Options:"
    echo "  -h, --help    Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start      # Start clean testing environment"
    echo "  $0 finish     # Finish and prepare for next test results"
}

# Function to get the next simple version number
get_next_version() {
    # Find the highest version number in test-results directory
    local highest_version=0
    
    # Check if test-results directory exists
    if [ ! -d "test-results" ]; then
        echo "v1"
        return
    fi
    
    # Look for existing version directories (v1, v2, v3, etc.)
    for dir in test-results/v[0-9]*; do
        if [ -d "$dir" ]; then
            # Extract version number from directory name
            local version_dir=$(basename "$dir")
            if [[ $version_dir =~ ^v([0-9]+)$ ]]; then
                local version_num=${BASH_REMATCH[1]}
                if (( version_num > highest_version )); then
                    highest_version=$version_num
                fi
            fi
        fi
    done
    
    # Increment version number
    local next_version=$((highest_version + 1))
    echo "v$next_version"
}

# Function to preserve test artifacts
preserve_artifacts() {
    local version_dir=$1
    
    # Create artifacts directory
    mkdir -p "test-results/$version_dir/artifacts"
    
    echo "Preserving test artifacts from current test session..."
    
    # Method 1: Copy commonly modified files (simple approach)
    local common_files=(
        "docs/api.md"
        "tests/authService.test.js"
        "src/authService.js"
        "src/index.js"
    )
    
    local copied_count=0
    for file in "${common_files[@]}"; do
        if [ -f "$file" ]; then
            # Get directory structure and create it in artifacts
            local dir_path=$(dirname "$file")
            mkdir -p "test-results/$version_dir/artifacts/$dir_path"
            
            # Copy file to artifacts directory
            cp "$file" "test-results/$version_dir/artifacts/$file"
            echo "  Copied $file"
            ((copied_count++))
        fi
    done
    
    # Method 2: Try to detect actual changes (advanced approach)
    # This would require more complex logic to compare with clean branch
    
    if [ $copied_count -eq 0 ]; then
        echo "  No common files found to preserve"
    else
        echo "  Preserved $copied_count common files"
    fi
    
    echo "Artifacts preserved in test-results/$version_dir/artifacts/"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        start|begin)
            ACTION="start"
            shift
            ;;
        finish|end)
            ACTION="finish"
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

case $ACTION in
    start)
        echo "Starting clean testing environment..."
        git checkout clean
        git reset --hard 387f041
        echo "Ready for agent testing!"
        echo "Run your agents now, then use: $0 finish"
        ;;
        
    finish)
        # Auto-detect next version
        VERSION=$(get_next_version)
        echo "Finishing test session for version $VERSION..."
        git checkout main
        
        # Create version directory if it doesn't exist
        mkdir -p "test-results/$VERSION"
        
        # Preserve test artifacts
        preserve_artifacts "$VERSION"
        
        echo "Test session completed for version $VERSION"
        echo "Test artifacts preserved in test-results/$VERSION/artifacts/"
        echo ""
        echo "Please review and commit your results:"
        echo "  git add test-results/$VERSION/"
        echo "  git commit -m \"Document $VERSION test results\""
        ;;
        
    *)
        show_help
        exit 1
        ;;
esac