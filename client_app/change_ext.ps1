<#
Fix: Removed incorrect TrimStart on substring. Using Join-Path with Substring safely.
#>

[CmdletBinding(SupportsShouldProcess=$true)]
param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$FolderPath,

    [Parameter(Mandatory=$true, Position=1)]
    [ValidateNotNullOrEmpty()]
    [string]$OldExtension,

    [Parameter(Mandatory=$true, Position=2)]
    [ValidateNotNullOrEmpty()]
    [string]$NewExtension,

    [Parameter()]
    [switch]$Recurse,

    [Parameter()]
    [switch]$Backup
)

function Normalize-Ext {
    param([string]$ext)
    if ($ext -like '.*') { return $ext.TrimStart('.') }
    return $ext
}

$oldExt = Normalize-Ext -ext $OldExtension
$newExt = Normalize-Ext -ext $NewExtension

if (-not (Test-Path -Path $FolderPath -PathType Container)) {
    Write-Error "Folder path '$FolderPath' does not exist or is not a directory."
    exit 2
}

if ($Backup.IsPresent) {
    $timestamp = (Get-Date).ToString('yyyyMMdd_HHmmss')
    $backupRoot = Join-Path -Path $FolderPath -ChildPath "backup_$timestamp"
    New-Item -Path $backupRoot -ItemType Directory -Force | Out-Null
}

# Correct Get-ChildItem usage
$files = if ($Recurse.IsPresent) {
    Get-ChildItem -Path $FolderPath -File -Recurse -ErrorAction Stop | Where-Object { $_.Extension.TrimStart('.') -ieq $oldExt }
} else {
    Get-ChildItem -Path $FolderPath -File -ErrorAction Stop | Where-Object { $_.Extension.TrimStart('.') -ieq $oldExt }
}

if (-not $files) {
    Write-Host "No files found with extension '.$oldExt' in '$FolderPath' (Recurse: $($Recurse.IsPresent))."
    return
}

Write-Host "Found $($files.Count) file(s) with extension '.$oldExt' in '$FolderPath'."

foreach ($f in $files) {
    try {
        $newName = [IO.Path]::ChangeExtension($f.FullName, '.' + $newExt)

        if ($Backup.IsPresent) {
            $relPath = $f.FullName.Substring($FolderPath.Length)
            if ($relPath.StartsWith([IO.Path]::DirectorySeparatorChar)) {
                $relPath = $relPath.Substring(1)
            }
            $backupPath = Join-Path -Path $backupRoot -ChildPath $relPath
            $backupDir = Split-Path -Path $backupPath -Parent
            if (-not (Test-Path -Path $backupDir)) { New-Item -Path $backupDir -ItemType Directory -Force | Out-Null }
            Copy-Item -Path $f.FullName -Destination $backupPath -Force -ErrorAction Stop
        }

        if ($PSCmdlet.ShouldProcess($f.FullName, "Rename to $newName")) {
            Rename-Item -LiteralPath $f.FullName -NewName (Split-Path -Leaf $newName) -ErrorAction Stop
            Write-Host "Renamed: $($f.Name) -> $(Split-Path -Leaf $newName)"
        }
    }
    catch {
        Write-Warning "Failed to process '$($f.FullName)': $_"
    }
}

Write-Host "Done."
