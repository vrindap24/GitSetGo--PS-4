# API Testing Script for ReviewSense

$baseUrl = "http://localhost:8000"
$apiV1 = "$baseUrl/api/v1"

function Write-Header($msg) {
    Write-Host "`n--- $msg ---" -ForegroundColor Cyan
}

try {
    # 1. Health Check
    Write-Header "Testing Health Check"
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "Status: $($health.status), Version: $($health.version)"

    # 2. Create Branch
    Write-Header "Creating a Test Branch"
    $branchData = @{
        branch_name = "Test Branch Alpha"
        location = "123 Test St, Tech City"
        manager_name = "Alice Tester"
        manager_contact = "alice@test.com"
    } | ConvertTo-Json
    $branch = Invoke-RestMethod -Uri "$apiV1/branches" -Method Post -Body $branchData -ContentType "application/json"
    $branchId = $branch.id
    Write-Host "Created Branch ID: $branchId"

    # 3. List Branches
    Write-Header "Listing All Branches"
    $branches = Invoke-RestMethod -Uri "$apiV1/branches" -Method Get
    Write-Host "Found $($branches.Count) branches"

    # 4. Get Specific Branch
    Write-Header "Getting Specific Branch"
    $branchInfo = Invoke-RestMethod -Uri "$apiV1/branches/$branchId" -Method Get
    Write-Host "Branch Name: $($branchInfo.branch_name)"

    # 5. Create Staff
    Write-Header "Creating Test Staff"
    $staffData = @{
        branch_id = $branchId
        staff_name = "Bob Developer"
        role = "Senior Engineer"
        active_status = $true
    } | ConvertTo-Json
    $staff = Invoke-RestMethod -Uri "$apiV1/staff" -Method Post -Body $staffData -ContentType "application/json"
    $staffId = $staff.id
    Write-Host "Created Staff ID: $staffId"

    # 6. List Staff
    Write-Header "Listing Staff for Branch"
    $staffList = Invoke-RestMethod -Uri "$apiV1/staff?branch_id=$branchId" -Method Get
    Write-Host "Found $($staffList.Count) staff members"

    # 7. Create Review
    Write-Header "Creating a Test Review"
    $reviewData = @{
        platform = "Internal"
        branch_id = $branchId
        rating = 2
        review_text = "The service was a bit slow today, but the food was okay. I spoke with Bob who was helpful."
        reviewer_name = "Charlie Customer"
        staff_tagged = $staffId
    } | ConvertTo-Json
    $review = Invoke-RestMethod -Uri "$apiV1/reviews" -Method Post -Body $reviewData -ContentType "application/json"
    $reviewId = $review.id
    Write-Host "Created Review ID: $reviewId"

    # 8. List Reviews
    Write-Header "Listing Reviews"
    $reviews = Invoke-RestMethod -Uri "$apiV1/reviews?branch_id=$branchId" -Method Get
    Write-Host "Found $($reviews.Count) reviews for this branch"

    # 9. Ingest from External Platforms
    Write-Header "Testing Google Ingestion"
    $ingestGoogle = Invoke-RestMethod -Uri "$apiV1/ingest/google?branch_id=$branchId" -Method Post
    Write-Host $ingestGoogle.message

    Write-Header "Testing Zomato Ingestion"
    $ingestZomato = Invoke-RestMethod -Uri "$apiV1/ingest/zomato?branch_id=$branchId" -Method Post
    Write-Host $ingestZomato.message

    # Give some time for background AI processing
    Write-Host "`nWaiting 5 seconds for AI processing..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5

    # 10. Analytics
    Write-Header "Analytics: Branch Overview"
    $overview = Invoke-RestMethod -Uri "$apiV1/analytics/branch-overview?branch_id=$branchId" -Method Get
    Write-Host "Avg Rating: $($overview.avg_rating), Total Reviews: $($overview.total_reviews)"

    Write-Header "Analytics: Branch Comparison"
    $comparison = Invoke-RestMethod -Uri "$apiV1/analytics/branch-comparison" -Method Get
    Write-Host "Compared $($comparison.Count) branches"

    Write-Header "Analytics: Staff Performance"
    $performance = Invoke-RestMethod -Uri "$apiV1/analytics/staff-performance?branch_id=$branchId" -Method Get
    if ($performance.Count -gt 0) {
        Write-Host "Performance data found for $($performance.Count) staff"
    } else {
        Write-Host "No performance data yet (might still be processing)"
    }

    # 11. Escalations
    Write-Header "Checking Escalations"
    $escalations = Invoke-RestMethod -Uri "$apiV1/escalations?branch_id=$branchId" -Method Get
    Write-Host "Found $($escalations.Count) escalations"

    if ($escalations.Count -gt 0) {
        $escId = $escalations[0].id
        Write-Header "Updating Escalation $escId"
        $escUpdate = @{
            status = "Resolved"
            resolution_notes = "Tested successfully via automation."
        } | ConvertTo-Json
        $updatedEsc = Invoke-RestMethod -Uri "$apiV1/escalations/$escId" -Method Patch -Body $escUpdate -ContentType "application/json"
        Write-Host "Escalation status: $($updatedEsc.status)"
    }

    # 12. Insights
    Write-Header "Insights: Branch"
    $bInsights = Invoke-RestMethod -Uri "$apiV1/insights/branch?branch_id=$branchId" -Method Get
    Write-Host "Summary: $($bInsights.summary)"

    Write-Header "Insights: Staff"
    $sInsights = Invoke-RestMethod -Uri "$apiV1/insights/staff?branch_id=$branchId" -Method Get
    Write-Host "Generated insights for staff performance."

    Write-Host "`nAll tests completed successfully!" -ForegroundColor Green
}
catch {
    Write-Error "Test failed: $_"
    exit 1
}
