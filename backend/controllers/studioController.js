const { getQuery, getSingle, runQuery } = require('../config/database');

// @desc    Get student's studio resources
// @route   GET /api/studio/student
// @access  Private (Student)
const getStudentStudioResources = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get studio resources from student's enrolled courses
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
    
    // Calculate statistics
    const stats = {
      total: resources.length,
      available: resources.filter(r => r.access === 'Available').length,
      recentlyUsed: resources.filter(r => r.lastUsed && 
        new Date(r.lastUsed) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Used in last 7 days
      ).length
    };
    
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
    
    res.json({
      success: true,
      resources: formattedResources,
      stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single studio resource details
// @route   GET /api/studio/student/:id
// @access  Private (Student)
const getStudentStudioResource = async (req, res) => {
  try {
    const studentId = req.user.id;
    const resourceId = req.params.id;
    
    // Check if student is enrolled in the course for this resource
    const resourceQuery = `
      SELECT sr.id, sr.title, sr.description, sr.type, sr.access, sr.launchUrl, sr.guideUrl, sr.supportUrl, sr.isActive, sr.createdAt,
             c.code as courseCode, c.name as courseName, c.id as courseId,
             sru.lastUsed, sru.accessCount
      FROM studio_resources sr
      INNER JOIN courses c ON sr.courseId = c.id
      INNER JOIN course_enrollments ce ON c.id = ce.courseId
      LEFT JOIN studio_resource_usage sru ON sr.id = sru.resourceId AND sru.studentId = ?
      WHERE sr.id = ? AND ce.studentId = ? AND c.isActive = 1 AND sr.isActive = 1
    `;
    
    const resource = await getSingle(resourceQuery, [studentId, resourceId, studentId]);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found or access denied' });
    }
    
    // Update usage record
    await runQuery(`
      INSERT INTO studio_resource_usage (resourceId, studentId, lastUsed, accessCount)
      VALUES (?, ?, datetime('now'), COALESCE((SELECT accessCount FROM studio_resource_usage WHERE resourceId = ? AND studentId = ?), 0) + 1)
      ON CONFLICT(resourceId, studentId) DO UPDATE SET
        lastUsed = datetime('now'),
        accessCount = accessCount + 1
    `, [resourceId, studentId, resourceId, studentId]);
    
    const formattedResource = {
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
      accessCount: (resource.accessCount || 0) + 1 // Increment for this access
    };
    
    res.json({
      success: true,
      resource: formattedResource
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all studio resources (for lecturers/admins)
// @route   GET /api/studio/resources
// @access  Private (Lecturer/Admin)
const getStudioResources = async (req, res) => {
  try {
    let resources;
    
    if (req.user.role === 'lecturer') {
      // Lecturers get resources from their courses
      const resourcesQuery = `
        SELECT sr.id, sr.title, sr.description, sr.type, sr.access, sr.launchUrl, sr.guideUrl, sr.supportUrl, sr.isActive, sr.createdAt,
               c.code as courseCode, c.name as courseName,
               COUNT(sru.id) as totalUsage
        FROM studio_resources sr
        INNER JOIN courses c ON sr.courseId = c.id
        LEFT JOIN studio_resource_usage sru ON sr.id = sru.resourceId
        WHERE c.lecturer = ? AND c.isActive = 1
        GROUP BY sr.id
        ORDER BY sr.title ASC
      `;
      
      resources = await getQuery(resourcesQuery, [req.user.id]);
    } else {
      // Admins get all resources
      const resourcesQuery = `
        SELECT sr.id, sr.title, sr.description, sr.type, sr.access, sr.launchUrl, sr.guideUrl, sr.supportUrl, sr.isActive, sr.createdAt,
               c.code as courseCode, c.name as courseName,
               COUNT(sru.id) as totalUsage
        FROM studio_resources sr
        INNER JOIN courses c ON sr.courseId = c.id
        LEFT JOIN studio_resource_usage sru ON sr.id = sru.resourceId
        WHERE c.isActive = 1
        GROUP BY sr.id
        ORDER BY sr.title ASC
      `;
      
      resources = await getQuery(resourcesQuery);
    }
    
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
      isActive: resource.isActive,
      totalUsage: resource.totalUsage || 0,
      createdAt: resource.createdAt
    }));
    
    res.json({
      success: true,
      resources: formattedResources
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create studio resource
// @route   POST /api/studio/resources
// @access  Private (Lecturer/Admin)
const createStudioResource = async (req, res) => {
  try {
    const { title, description, type, courseId, access, launchUrl, guideUrl, supportUrl } = req.body;
    
    // Verify course exists and lecturer owns it (for lecturers)
    if (req.user.role === 'lecturer') {
      const courseQuery = 'SELECT id FROM courses WHERE id = ? AND lecturer = ? AND isActive = 1';
      const course = await getSingle(courseQuery, [courseId, req.user.id]);
      
      if (!course) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    
    // Create resource
    const insertQuery = `
      INSERT INTO studio_resources (title, description, type, courseId, access, launchUrl, guideUrl, supportUrl, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `;
    
    await runQuery(insertQuery, [title, description, type, courseId, access, launchUrl, guideUrl, supportUrl]);
    
    // Get the created resource
    const newResourceQuery = `
      SELECT sr.id, sr.title, sr.description, sr.type, sr.access, sr.launchUrl, sr.guideUrl, sr.supportUrl, sr.isActive, sr.createdAt,
             c.code as courseCode, c.name as courseName
      FROM studio_resources sr
      INNER JOIN courses c ON sr.courseId = c.id
      WHERE sr.id = last_insert_rowid()
    `;
    
    const newResource = await getSingle(newResourceQuery);
    
    res.status(201).json({
      success: true,
      resource: {
        id: newResource.id,
        title: newResource.title,
        description: newResource.description,
        type: newResource.type,
        course: newResource.courseCode,
        courseName: newResource.courseName,
        access: newResource.access,
        launchUrl: newResource.launchUrl,
        guideUrl: newResource.guideUrl,
        supportUrl: newResource.supportUrl,
        isActive: newResource.isActive,
        createdAt: newResource.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update studio resource
// @route   PUT /api/studio/resources/:id
// @access  Private (Lecturer/Admin)
const updateStudioResource = async (req, res) => {
  try {
    const resourceId = req.params.id;
    const { title, description, type, access, launchUrl, guideUrl, supportUrl, isActive } = req.body;
    
    // Check if resource exists and user has access
    const resourceQuery = `
      SELECT sr.id, sr.courseId, c.lecturer
      FROM studio_resources sr
      INNER JOIN courses c ON sr.courseId = c.id
      WHERE sr.id = ?
    `;
    
    const resource = await getSingle(resourceQuery, [resourceId]);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if lecturer owns the resource
    if (req.user.role === 'lecturer' && resource.lecturer !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Update resource
    const updateQuery = `
      UPDATE studio_resources
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          type = COALESCE(?, type),
          access = COALESCE(?, access),
          launchUrl = COALESCE(?, launchUrl),
          guideUrl = COALESCE(?, guideUrl),
          supportUrl = COALESCE(?, supportUrl),
          isActive = COALESCE(?, isActive),
          updatedAt = datetime('now')
      WHERE id = ?
    `;
    
    await runQuery(updateQuery, [title, description, type, access, launchUrl, guideUrl, supportUrl, isActive, resourceId]);
    
    // Get updated resource
    const updatedResourceQuery = `
      SELECT sr.id, sr.title, sr.description, sr.type, sr.access, sr.launchUrl, sr.guideUrl, sr.supportUrl, sr.isActive, sr.createdAt, sr.updatedAt,
             c.code as courseCode, c.name as courseName
      FROM studio_resources sr
      INNER JOIN courses c ON sr.courseId = c.id
      WHERE sr.id = ?
    `;
    
    const updatedResource = await getSingle(updatedResourceQuery, [resourceId]);
    
    res.json({
      success: true,
      resource: {
        id: updatedResource.id,
        title: updatedResource.title,
        description: updatedResource.description,
        type: updatedResource.type,
        course: updatedResource.courseCode,
        courseName: updatedResource.courseName,
        access: updatedResource.access,
        launchUrl: updatedResource.launchUrl,
        guideUrl: updatedResource.guideUrl,
        supportUrl: updatedResource.supportUrl,
        isActive: updatedResource.isActive,
        createdAt: updatedResource.createdAt,
        updatedAt: updatedResource.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete studio resource
// @route   DELETE /api/studio/resources/:id
// @access  Private (Lecturer/Admin)
const deleteStudioResource = async (req, res) => {
  try {
    const resourceId = req.params.id;
    
    // Check if resource exists and user has access
    const resourceQuery = `
      SELECT sr.id, sr.courseId, c.lecturer
      FROM studio_resources sr
      INNER JOIN courses c ON sr.courseId = c.id
      WHERE sr.id = ?
    `;
    
    const resource = await getSingle(resourceQuery, [resourceId]);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if lecturer owns the resource
    if (req.user.role === 'lecturer' && resource.lecturer !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Soft delete by setting isActive to false
    await runQuery('UPDATE studio_resources SET isActive = 0, updatedAt = datetime(\'now\') WHERE id = ?', [resourceId]);
    
    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to format time ago
function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return diffMinutes === 0 ? 'Just now' : `${diffMinutes} minutes ago`;
    }
    return `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
}

module.exports = {
  getStudentStudioResources,
  getStudentStudioResource,
  getStudioResources,
  createStudioResource,
  updateStudioResource,
  deleteStudioResource
};
