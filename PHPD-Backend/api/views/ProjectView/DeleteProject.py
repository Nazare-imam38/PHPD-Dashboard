from ..common_imports import *

class ProjectDeleteView(viewsets.ViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, HasSidebarPermission]
    sidebar_label = "Project Management"
    sub_label = "Delete"

    def retrieve(self, request, *args, **kwargs):
        """GET /api/delete-project/{id}/ — returns counts of what will be deleted, for a confirmation prompt."""
        project_id = kwargs.get('pk')
        try:
            myproject = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return ApiResponse(
                status=status.HTTP_404_NOT_FOUND,
                message="Project not found.",
                http_status=status.HTTP_404_NOT_FOUND
            ).create_response()

        activities = myproject.activities.all()
        activities_count = activities.count()
        images_count = ProgressImage.objects.filter(project=myproject).count()
        documents_count = myproject.documents.count()

        # Per-activity breakdown — only include activities that actually have
        # images or documents attached, so the frontend can list specifics.
        activities_with_attachments = []
        for activity in activities.prefetch_related("images", "documents"):
            img_count = activity.images.count()
            doc_count = activity.documents.count()
            if img_count or doc_count:
                activities_with_attachments.append({
                    "activity_id": activity.id,
                    "activity_name": activity.activity_name,
                    "images_count": img_count,
                    "documents_count": doc_count,
                })

        return ApiResponse(
            status=status.HTTP_200_OK,
            message="Delete impact summary.",
            data={
                "project_id": myproject.id,
                "project_name": myproject.project_name,
                "activities_count": activities_count,
                "images_count": images_count,
                "documents_count": documents_count,
                "has_xer_file": bool(myproject.xer_file),
                "activities_with_attachments": activities_with_attachments,
            },
            http_status=status.HTTP_200_OK
        ).create_response()

    def destroy(self, request, *args, **kwargs):
        project_id = kwargs.get('pk')

        try:
            myproject = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return ApiResponse(
                status=status.HTTP_404_NOT_FOUND,
                message="Project not found.",
                http_status=status.HTTP_404_NOT_FOUND
            ).create_response()
        try:
            myproject.delete()
            return ApiResponse(
                status=status.HTTP_200_OK,
                message="Project deleted successfully.",
                http_status=status.HTTP_200_OK
            ).create_response()
        except ProtectedError:
            return ApiResponse(
                status=status.HTTP_400_BAD_REQUEST,
                message="Cannot delete this Project because it is linked to other records.",
                http_status=status.HTTP_400_BAD_REQUEST
            ).create_response()
        except IntegrityError:
            return ApiResponse(
                status=status.HTTP_400_BAD_REQUEST,
                message="Cannot delete this Project because it is linked to other records.",
                http_status=status.HTTP_400_BAD_REQUEST
            ).create_response()
        except serializers.ValidationError as e:
            return ApiResponse(
                status=status.HTTP_400_BAD_REQUEST,
                message=str(e),
                http_status=status.HTTP_400_BAD_REQUEST
            ).create_response()
        except Exception as e:
            return ApiResponse(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message=str(e),
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ).create_response()