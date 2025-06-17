import * as React from 'react'
import { ChevronRight } from 'lucide-react'

import { cn } from '../../lib/utils'

const Breadcrumb = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
    <nav
        ref={ref}
        aria-label="breadcrumb"
        className={cn(
            'text-muted-foreground flex flex-wrap items-center text-sm',
            className,
        )}
        {...props}
    />
))
Breadcrumb.displayName = 'Breadcrumb'

const BreadcrumbList = React.forwardRef<
    HTMLOListElement,
    React.OlHTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
    <ol
        ref={ref}
        className={cn(
            'flex flex-wrap items-center gap-1.5 sm:gap-2.5',
            className,
        )}
        {...props}
    />
))
BreadcrumbList.displayName = 'BreadcrumbList'

const BreadcrumbItem = React.forwardRef<
    HTMLLIElement,
    React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
    <li
        ref={ref}
        className={cn('inline-flex items-center gap-1.5', className)}
        {...props}
    />
))
BreadcrumbItem.displayName = 'BreadcrumbItem'

const BreadcrumbLink = React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        asChild?: boolean
    }
>(({ asChild, className, ...props }, ref) => {
    return (
        <a
            ref={ref}
            className={cn(
                'hover:text-foreground text-sm hover:underline',
                className,
            )}
            {...props}
        />
    )
})
BreadcrumbLink.displayName = 'BreadcrumbLink'

const BreadcrumbPage = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
    <span
        ref={ref}
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cn('text-foreground text-sm font-medium', className)}
        {...props}
    />
))
BreadcrumbPage.displayName = 'BreadcrumbPage'

const BreadcrumbSeparator = ({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
    <span
        role="presentation"
        aria-hidden="true"
        className={cn('text-muted-foreground', className)}
        {...props}
    >
        {children || <ChevronRight className="h-3.5 w-3.5" />}
    </span>
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

const BreadcrumbEllipsis = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
    <span
        role="presentation"
        aria-hidden="true"
        className={cn('flex h-9 w-9 items-center justify-center', className)}
        {...props}
    >
        <span className="text-muted-foreground text-sm">...</span>
    </span>
)
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'

export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
}
