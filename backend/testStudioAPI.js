const { getQuery } = require('./config/database');

async function testStudioAPI() {
  try {
    console.log('Testing studio API functionality...');
    
    const studentId = 10; // This should be a student ID from the enrollments
    
    // Test the same query used in the studio controller
    const resourcesQuery = `
      SELECT sr.id, sr.title, sr.description, sr.type, sr.access, sr.launchUrl, sr.guideUrl, sr.supportUrl, sr.isActive, sr.createdAt,
             c.code as courseCode, c.name as courseName,
             sru.lastUsed, sru.accessCount
      FROM studio_resources sr
      INNER JOIN courses c ON sr.courseId = c.id
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      LEFT JOIN studio_resource_usage sru ON sr.id = sru.resourceId AND sru.studentId = ?
      WHERE ce.studentId = ? AND c.isActive = 1 AND sr.isActive = 1
      ORDER BY sru.lastUsed DESC NULLS LAST, sr.title ASC
    `;
    
    const resources = await getQuery(resourcesQuery, [studentId, studentId]);
    
    console.log('Found studio resources for student:', resources.length);
    
    if (resources.length > 0) {
      console.log('First resource:', resources[0]);
    }
    
    // Calculate statistics
    const stats = {
      total: resources.length,
      available: resources.filter(r => r.access === 'Available').length,
      recentlyUsed: resources.filter(r => r.lastUsed && 
        new Date(r.lastUsed) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length
    };
    
    console.log('Statistics:', stats);
    
    // Format resources for frontend
    const formattedResources = resources.map(resource => ({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      type: resource.type,
      course: resource.courseCode,
      courseName: resource.courseName,
      access: resource.access,
      launchUrl: resource.launchUrl,
      guideUrl: resource.guideUrl,
      supportUrl: resource.supportUrl,
      lastUsed: resource.lastUsed ? getTimeAgo(resource.lastUsed) : 'Never',
      accessCount: resource.accessCount || 0
    }));
    
    const apiResponse = {
      success: true,
      resources: formattedResources,
      stats
    };
    
    console.log('API Response Summary:');
    console.log('- Success:', apiResponse.success);
    console.log('- Total resources:', apiResponse.resources.length);
    console.log('- Stats:', apiResponse.stats);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return `${diffDays} days ago`;
  }
}

testStudioAPI();
